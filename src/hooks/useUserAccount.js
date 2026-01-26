import { useState, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { db, auth } from "../services/firebase";

/**
 * Custom hook for managing user accounts with WeChat authentication and Firebase Auth
 */
export const useUserAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Monitor Firebase Auth state
  const initializeAuthListener = useCallback(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[useUserAccount] Firebase Auth state changed:", user?.uid);
      setFirebaseUser(user);
    });
    return unsubscribe;
  }, []);

  /**
   * Generate email from WeChat user data using the pattern:
   * nickname (no spaces) + last 4 of unionid + @gmail.com
   */
  const generateEmailFromWeChatUser = useCallback((unionid, nickname) => {
    console.log("[useUserAccount] Generating email", {
      unionid: unionid?.substring(0, 10) + "...",
      nickname,
    });

    // Get last 4 characters of unionid
    const last4 = unionid.slice(-4);

    // Clean nickname - remove spaces and special characters
    const nicknameCleaned = (nickname || "user")
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    // Generate email
    const email = `${nicknameCleaned}${last4}@gmail.com`?.toLowerCase();

    console.log("[useUserAccount] Email generated:", email, {
      original: nickname,
      cleaned: nicknameCleaned,
      last4,
    });

    return email;
  }, []);

  /**
   * Generate a secure password from WeChat data
   */
  const generatePasswordFromWeChatUser = useCallback((unionid, openid) => {
    // Create a secure password using unionid and openid
    const combinedId = `${unionid}_${openid}`;
    // Use parts of the IDs to create a password
    const password = `WC_${combinedId.substring(0, 8)}_${combinedId.slice(
      -8
    )}!`;
    return password;
  }, []);

  /**
   * Authenticate user with Firebase Auth
   */
  const authenticateWithFirebase = useCallback(
    async (email, password, userData) => {
      console.log("[useUserAccount] Authenticating with Firebase Auth");

      try {
        let firebaseUser = null;

        // Try to sign in first
        try {
          console.log("[useUserAccount] Attempting to sign in existing user");
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          firebaseUser = userCredential.user;
          console.log(
            "[useUserAccount] Existing Firebase user signed in:",
            firebaseUser.uid
          );
        } catch (signInError) {
          console.log(
            "[useUserAccount] Sign in failed, creating new Firebase user"
          );

          // If sign in fails, create new user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          firebaseUser = userCredential.user;
          console.log(
            "[useUserAccount] New Firebase user created:",
            firebaseUser.uid
          );

          // Update the Firebase user profile
          await updateProfile(firebaseUser, {
            displayName: userData.nickname || userData.name,
            photoURL: userData.headimgurl || userData.avatar,
          });

          console.log("[useUserAccount] Firebase user profile updated");
        }

        return {
          success: true,
          firebaseUser,
          firebaseUid: firebaseUser.uid,
        };
      } catch (error) {
        console.error(
          "[useUserAccount] Firebase authentication failed:",
          error
        );
        return {
          success: false,
          error: error.message,
          firebaseUser: null,
          firebaseUid: null,
        };
      }
    },
    []
  );

  /**
   * Check if account exists by email
   */
  const checkAccountExists = useCallback(async (email) => {
    console.log("[useUserAccount] Checking account existence for:", email);

    try {
      const accountsRef = collection(db, "accounts");
      const q = query(accountsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const accountDoc = querySnapshot.docs[0];
        const data = { id: accountDoc.id, ...accountDoc.data() };

        console.log("[useUserAccount] Account found:", accountDoc.id);
        // alert(
        //   `✅ Existing account found!\nID: ${accountDoc.id}\nEmail: ${data.email}`
        // );

        return {
          exists: true,
          data: data,
          method: "query",
        };
      }

      console.log("[useUserAccount] No account found");
      return {
        exists: false,
        data: null,
        method: "not_found",
      };
    } catch (error) {
      console.error("[useUserAccount] Error checking account:", error);
      return {
        exists: false,
        data: null,
        error: error.message,
        method: "error_fallback",
      };
    }
  }, []);

  /**
   * Create new account with Firebase Auth
   */
  const createNewAccount = useCallback(
    async (wechatUserInfo, email) => {
      console.log("[useUserAccount] Creating new account for:", email);

      const {
        openid,
        nickname,
        headimgurl,
        sex,
        country,
        province,
        city,
        unionid,
      } = wechatUserInfo.user || wechatUserInfo;

      try {
        // Step 1: Authenticate with Firebase
        const password = generatePasswordFromWeChatUser(unionid, openid);
        const firebaseAuth = await authenticateWithFirebase(email, password, {
          nickname,
          headimgurl,
          name: nickname,
          avatar: headimgurl,
        });

        if (!firebaseAuth.success) {
          throw new Error(
            `Firebase authentication failed: ${firebaseAuth.error}`
          );
        }

        // ✅ Step 2: Use firebaseUid as the document ID
        const firebaseUid = firebaseAuth.firebaseUid;
        const accountsRef = collection(db, "accounts");
        const newAccountRef = doc(accountsRef, firebaseUid); // Use firebaseUid as docId

        // ✅ Create account data with only specified fields
        const newAccountData = {
          // ✅ Use firebaseUid as userId (for app compatibility)

          // Required fields
          email: email,
          name: nickname || "WeChat User",
          profilePictureUrl: headimgurl || "",

          // Authentication flags
          isAdmin: false,
          isChef: false,
          isLogInWithWechat: true,
          wantsToBeChef: false,

          // ✅ WeChat IDs for app compatibility
          unionid: unionid || "",
          openid: openid || "",

          // Optional fields
          favoriteCuisines: [],
          howHeardAboutUs: "WeChat",
          registeredFrom: "web",
          fcmToken: "",

          // Timestamps
          accountCreationDate: serverTimestamp(),
        };

        console.log(
          "[useUserAccount] Saving to Firestore with firebaseUid as docId..."
        );
        console.log("[useUserAccount] Document ID (firebaseUid):", firebaseUid);
        await setDoc(newAccountRef, newAccountData);

        console.log("[useUserAccount] Account created with ID:", firebaseUid);

        return {
          success: true,
          account: {
            id: firebaseUid, // Return firebaseUid as account id
            ...newAccountData,
            accountCreationDate: new Date().toISOString(),
            firebaseUid: firebaseUid,
          },
          firebaseUser: firebaseAuth.firebaseUser,
        };
      } catch (error) {
        console.error("[useUserAccount] Error creating account:", error);
        alert(`❌ Failed to create account:\n${error.message}`);
        throw error;
      }
    },
    [generatePasswordFromWeChatUser, authenticateWithFirebase]
  );

  /**
   * Update existing account login with Firebase Auth
   */
  const updateAccountLogin = useCallback(
    async (accountId, wechatUserInfo) => {
      console.log("[useUserAccount] Updating login for account:", accountId);
      console.log(
        "[useUserAccount] Skipping Firebase authentication for existing user update"
      );

      try {
        // Get existing account data
        const accountRef = doc(db, "accounts", accountId);
        const accountSnap = await getDoc(accountRef);

        if (!accountSnap.exists()) {
          throw new Error("Account not found");
        }

        // ✅ NO Firebase authentication - just update Firestore document
        const updateData = {
          lastLoginAt: serverTimestamp(),
          wechatOpenId: wechatUserInfo.openid || wechatUserInfo.user?.openid,
          wechatAvatar:
            wechatUserInfo.user?.headimgurl || wechatUserInfo.headimgurl || "",
          wechatNickname:
            wechatUserInfo.user?.nickname || wechatUserInfo.nickname || "",
        };

        await updateDoc(accountRef, updateData);

        console.log(
          "[useUserAccount] Login updated successfully without Firebase auth"
        );
        return { success: true };
      } catch (error) {
        console.error("[useUserAccount] Error updating login:", error);
        return { success: false, error: error.message };
      }
    },
    [] // ✅ Removed Firebase dependencies
  );

  /**
   * Main function to process WeChat account with Firebase Auth
   */
  const processWeChatAccount = useCallback(
    async (wechatUserInfo) => {
      console.log(
        "[useUserAccount] Processing WeChat account with Firebase Auth"
      );
      setLoading(true);
      setError(null);

      try {
        // Validate input
        if (!wechatUserInfo) {
          throw new Error("No WeChat user info provided");
        }
        const userInfo = wechatUserInfo.user || wechatUserInfo;
        const { unionid, nickname } = userInfo;

        if (!unionid) {
          throw new Error("No UnionID in WeChat user info");
        }

        // Generate email
        const email = generateEmailFromWeChatUser(unionid, nickname);

        // alert(
        //   `🔄 Processing WeChat account:\nNickname: ${nickname}\nEmail: ${email}`
        // );

        // Check if account exists
        const accountCheck = await checkAccountExists(email);

        if (accountCheck.exists) {
          // ✅ EXISTING USER - Skip Firebase Auth, just return stored data
          console.log(
            `[useUserAccount] Existing user found - Document ID: ${accountCheck.data.id}`
          );
          console.log(
            `[useUserAccount] Skipping Firebase authentication for existing user`
          );
          console.log(
            `[useUserAccount] Using stored Firebase UID: ${
              accountCheck.data.firebaseUid || "Not available"
            }`
          );

          // Update last login (non-blocking) - no Firebase auth needed
          updateAccountLogin(accountCheck.data.id, wechatUserInfo).catch(
            (err) => {
              console.warn("[useUserAccount] Failed to update login:", err);
            }
          );

          const result = {
            isNewUser: false,
            account: accountCheck.data,
            email,
            method: accountCheck.method,
            // ✅ Return existing user data with stored Firebase UID
            userId: accountCheck.data.id,
            documentId: accountCheck.data.id,
            firebaseUid: accountCheck.data.firebaseUid || null, // Use stored Firebase UID
            firebaseUser: null, // Don't return Firebase user object for existing users
            isExistingUser: true, // Flag to indicate this is existing user data
          };

          setAccountData(result);

          // alert(
          //   `✅ Existing user logged in!\n` +
          //     `- Document ID: ${result.documentId}\n` +
          //     `- Stored Firebase UID: ${
          //       result.firebaseUid || "Not available"
          //     }\n` +
          //     `- Email: ${result.email}`
          // );

          return result;
        }

        // ✅ NEW USER - Create account with Firebase Auth
        console.log(`[useUserAccount] Creating new account for: ${nickname}`);
        console.log(
          `[useUserAccount] New user will be authenticated with Firebase`
        );

        const createResult = await createNewAccount(wechatUserInfo, email);

        if (createResult.success) {
          console.log(
            `[useUserAccount] New account created - Document ID: ${createResult.account.id}`
          );

          const result = {
            isNewUser: true,
            account: createResult.account,
            email,
            method: "created",
            // ✅ Return new user data with fresh Firebase UID
            userId: createResult.account.id,
            documentId: createResult.account.id,
            firebaseUid: createResult.account.firebaseUid,
            firebaseUser: createResult.firebaseUser,
            isExistingUser: false,
          };

          setAccountData(result);
          return result;
        }

        throw new Error("Account creation failed");
      } catch (err) {
        console.error("[useUserAccount] Error:", err);
        setLoading(false);
        return err;
      } finally {
        setLoading(false);
      }
    },
    [
      generateEmailFromWeChatUser,
      checkAccountExists,
      createNewAccount,
      updateAccountLogin,
      generatePasswordFromWeChatUser,
      authenticateWithFirebase,
    ]
  );

  /**
   * Sign out from Firebase Auth
   */
  const signOutFromFirebase = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setFirebaseUser(null);
      setAccountData(null);
      console.log("[useUserAccount] Signed out from Firebase");
      return { success: true };
    } catch (error) {
      console.error("[useUserAccount] Error signing out:", error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get account by ID
   */
  const getAccountById = useCallback(async (accountId) => {
    console.log("[useUserAccount] Fetching account:", accountId);

    if (!accountId) return null;

    try {
      const accountRef = doc(db, "accounts", accountId);
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const data = { id: accountSnap.id, ...accountSnap.data() };
        console.log("[useUserAccount] Account fetched:", data);
        return data;
      }

      return null;
    } catch (error) {
      console.error("[useUserAccount] Error fetching account:", error);
      return null;
    }
  }, []);

  /**
   * Check if user exists in accounts collection by userId
   * @param {string} userId - The user ID (Firebase UID or account document ID)
   * @returns {Promise<{exists: boolean, data: object|null, error?: string}>}
   */
  const checkUserExistsById = useCallback(async (userId) => {
    console.log("[useUserAccount] Checking if user exists by ID:", userId);

    if (!userId) {
      console.log("[useUserAccount] No user ID provided");
      return { exists: false, data: null, error: "No user ID provided" };
    }

    try {
      const accountRef = doc(db, "accounts", userId);
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const data = { id: accountSnap.id, ...accountSnap.data() };
        console.log(
          "[useUserAccount] ✅ User exists in accounts collection:",
          userId
        );
        return { exists: true, data };
      }

      console.log(
        "[useUserAccount] ❌ User does NOT exist in accounts collection:",
        userId
      );
      return { exists: false, data: null };
    } catch (error) {
      console.error("[useUserAccount] Error checking user existence:", error);
      return { exists: false, data: null, error: error.message };
    }
  }, []);

  /**
   * Update user profile
   */
  const updateUserProfile = useCallback(async (accountId, updates) => {
    console.log("[useUserAccount] Updating profile:", accountId);

    if (!accountId || accountId.startsWith("temp_")) {
      return { success: false, error: "Temporary account" };
    }

    try {
      const accountRef = doc(db, "accounts", accountId);

      await updateDoc(accountRef, {
        ...updates,
        lastUpdatedAt: serverTimestamp(),
      });

      console.log("[useUserAccount] Profile updated");
      return { success: true };
    } catch (error) {
      console.error("[useUserAccount] Error updating profile:", error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get user's account balance
   * @param {string} userId - The user ID
   * @returns {Promise<number>} - The user's account balance
   */
  const getUserBalance = useCallback(async (userId) => {
    console.log("[useUserAccount] Getting balance for user:", userId);

    if (!userId) {
      console.log("[useUserAccount] No user ID provided");
      return 0;
    }

    try {
      const accountRef = doc(db, "accounts", userId);
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const data = accountSnap.data();
        const balance = data.accountBalance || 0;
        console.log("[useUserAccount] User balance:", balance);
        return balance;
      }

      console.log("[useUserAccount] User not found, returning 0 balance");
      return 0;
    } catch (error) {
      console.error("[useUserAccount] Error getting balance:", error);
      return 0;
    }
  }, []);

  /**
   * Add amount to user's account balance (for refunds)
   * @param {string} userId - The user ID
   * @param {number} amount - Amount to add
   * @returns {Promise<{success: boolean, newBalance?: number, error?: string}>}
   */
  const addToBalance = useCallback(async (userId, amount) => {
    console.log("[useUserAccount] Adding to balance:", { userId, amount });

    if (!userId) {
      return { success: false, error: "No user ID provided" };
    }

    if (amount <= 0) {
      return { success: false, error: "Amount must be positive" };
    }

    try {
      const accountRef = doc(db, "accounts", userId);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const currentBalance = accountSnap.data().accountBalance || 0;
      const newBalance = currentBalance + amount;

      await updateDoc(accountRef, {
        accountBalance: newBalance,
        lastBalanceUpdate: serverTimestamp(),
      });

      console.log("[useUserAccount] Balance updated:", { currentBalance, amount, newBalance });
      return { success: true, newBalance };
    } catch (error) {
      console.error("[useUserAccount] Error adding to balance:", error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Deduct amount from user's account balance (for payments)
   * @param {string} userId - The user ID
   * @param {number} amount - Amount to deduct
   * @returns {Promise<{success: boolean, newBalance?: number, error?: string}>}
   */
  const deductFromBalance = useCallback(async (userId, amount) => {
    console.log("[useUserAccount] Deducting from balance:", { userId, amount });

    if (!userId) {
      return { success: false, error: "No user ID provided" };
    }

    if (amount <= 0) {
      return { success: false, error: "Amount must be positive" };
    }

    try {
      const accountRef = doc(db, "accounts", userId);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        return { success: false, error: "User not found" };
      }

      const currentBalance = accountSnap.data().accountBalance || 0;

      if (currentBalance < amount) {
        return { success: false, error: "Insufficient balance" };
      }

      const newBalance = currentBalance - amount;

      await updateDoc(accountRef, {
        accountBalance: newBalance,
        lastBalanceUpdate: serverTimestamp(),
      });

      console.log("[useUserAccount] Balance deducted:", { currentBalance, amount, newBalance });
      return { success: true, newBalance };
    } catch (error) {
      console.error("[useUserAccount] Error deducting balance:", error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    // State
    loading,
    error,
    accountData,
    firebaseUser,

    // Functions
    processWeChatAccount,
    checkUserExistsById,
    getAccountById,
    updateUserProfile,
    generateEmailFromWeChatUser,
    checkAccountExists,
    signOutFromFirebase,
    initializeAuthListener,
    // Balance management
    getUserBalance,
    addToBalance,
    deductFromBalance,
  };
};
