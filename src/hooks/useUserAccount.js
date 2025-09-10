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
import { db } from "../services/firebase";

/**
 * Custom hook for managing user accounts with WeChat authentication
 */
export const useUserAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState(null);

  /**
   * Generate email from WeChat user data using the pattern:
   * nickname (no spaces) + last 4 of openid + @gmail.com
   */
  const generateEmailFromWeChatUser = useCallback((unionid, nickname) => {
    console.log("[useUserAccount] Generating email", {
      openid: unionid?.substring(0, 10) + "...",
      nickname,
    });

    // Get last 4 characters of openid
    const last4 = unionid.slice(-4);

    // Clean nickname - remove spaces and special characters
    const nicknameCleaned = (nickname || "user")
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[^a-zA-Z0-9]/g, "") // Keep only alphanumeric
      .toLowerCase();

    // Generate email
    const email = `${nicknameCleaned}${last4}@gmail.com`;

    console.log("[useUserAccount] Email generated:", email, {
      original: nickname,
      cleaned: nicknameCleaned,
      last4,
    });

    // alert(
    //   `📧 Generated email pattern:\n${nicknameCleaned} + ${last4} + @gmail.com\n= ${email}`
    // );

    return email;
  }, []);

  /**
   * Check if account exists by email
   */
  const checkAccountExists = useCallback(async (email) => {
    console.log("[useUserAccount] Checking account existence for:", email);
    // alert(`🔍 Checking if account exists:\nEmail: ${email}`);

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
      // alert(
      //   `❌ No existing account found for:\n${email}\nWill create new account.`
      // );

      return {
        exists: false,
        data: null,
        method: "not_found",
      };
    } catch (error) {
      console.error("[useUserAccount] Error checking account:", error);
      // alert(`⚠️ Error checking account:\n${error.message}`);

      return {
        exists: false,
        data: null,
        error: error.message,
        method: "error_fallback",
      };
    }
  }, []);

  /**
   * Create new account
   */
  const createNewAccount = useCallback(async (wechatUserInfo, email) => {
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
      const accountsRef = collection(db, "accounts");
      const newAccountRef = doc(accountsRef); // Auto-generate ID

      const newAccountData = {
        // Required fields
        email: email,
        name: nickname || "WeChat User",

        // Authentication flags
        isAdmin: false,
        isChef: false,
        isLogInWithWechat: true,
        wantsToBeChef: false,

        // WeChat specific data
        wechatOpenId: openid,
        wechatUnionId: unionid || "",
        wechatNickname: nickname || "",
        wechatAvatar: headimgurl || "",
        wechatSex: sex || 0,
        wechatCountry: country || "",
        wechatProvince: province || "",
        wechatCity: city || "",

        // Optional fields
        favoriteCuisines: [],
        howHeardAboutUs: "WeChat",
        fcmToken: "",

        // Timestamps
        accountCreationDate: serverTimestamp(),
        lastLoginAt: serverTimestamp(),

        // Metadata
        authMethod: "wechat",
        profileComplete: false,
      };

      console.log("[useUserAccount] Saving to Firestore...");
      await setDoc(newAccountRef, newAccountData);

      console.log("[useUserAccount] Account created:", newAccountRef.id);
      // alert(
      //   `✅ New account created!\nID: ${newAccountRef.id}\nEmail: ${email}`
      // );

      return {
        success: true,
        account: {
          id: newAccountRef.id,
          ...newAccountData,
          accountCreationDate: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("[useUserAccount] Error creating account:", error);
      // alert(`❌ Failed to create account:\n${error.message}`);
      throw error;
    }
  }, []);

  /**
   * Update existing account login
   */
  const updateAccountLogin = useCallback(async (accountId, wechatUserInfo) => {
    console.log("[useUserAccount] Updating login for account:", accountId);

    try {
      const accountRef = doc(db, "accounts", accountId);

      const updateData = {
        lastLoginAt: serverTimestamp(),
        wechatOpenId: wechatUserInfo.openid || wechatUserInfo.user?.openid,
        wechatAvatar:
          wechatUserInfo.user?.headimgurl || wechatUserInfo.headimgurl || "",
        wechatNickname:
          wechatUserInfo.user?.nickname || wechatUserInfo.nickname || "",
      };

      await updateDoc(accountRef, updateData);

      console.log("[useUserAccount] Login updated");
      // alert(`✅ Welcome back!\nLast login updated.`);

      return { success: true };
    } catch (error) {
      console.error("[useUserAccount] Error updating login:", error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Main function to process WeChat account
   */
  const processWeChatAccount = useCallback(
    async (wechatUserInfo) => {
      console.log("[useUserAccount] Processing WeChat account");
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

        alert(
          `🔄 Processing WeChat account:\nNickname: ${nickname}\nEmail: ${email}`
        );

        // Check if account exists
        const accountCheck = await checkAccountExists(email);

        if (accountCheck.exists) {
          // Existing user
          // alert(
          //   `✅ Welcome back ${nickname}!\nAccount ID: ${accountCheck.data.id}`
          // );

          // Update last login (non-blocking)
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
          };

          setAccountData(result);
          return result;
        }

        // Create new account
        // alert(`🆕 Creating new account for ${nickname}...`);

        const createResult = await createNewAccount(wechatUserInfo, email);

        if (createResult.success) {
          // alert(
          //   `🎉 Welcome ${nickname}!\nYour account has been created successfully!`
          // );

          const result = {
            isNewUser: true,
            account: createResult.account,
            email,
            method: "created",
          };

          setAccountData(result);
          return result;
        }

        throw new Error("Account creation failed");
      } catch (err) {
        console.error("[useUserAccount] Error:", err);
        setError(err.message);

        // Create fallback account for session
        const userInfo = wechatUserInfo.user || wechatUserInfo;
        const { openid, nickname } = userInfo;
        const email = generateEmailFromWeChatUser(openid, nickname);

        const fallbackResult = {
          isNewUser: true,
          account: {
            id: `temp_${openid}`,
            email: email,
            name: nickname || "WeChat User",
            isTemporary: true,
            wechatOpenId: openid,
            error: err.message,
          },
          email,
          method: "fallback",
          error: err.message,
        };

        setAccountData(fallbackResult);
        // alert(`⚠️ Using temporary account.\nSome features may be limited.`);

        return fallbackResult;
      } finally {
        setLoading(false);
      }
    },
    [
      generateEmailFromWeChatUser,
      checkAccountExists,
      createNewAccount,
      updateAccountLogin,
    ]
  );

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
   * Update user profile
   */
  const updateUserProfile = useCallback(async (accountId, updates) => {
    console.log("[useUserAccount] Updating profile:", accountId);

    if (!accountId || accountId.startsWith("temp_")) {
      // alert("⚠️ Cannot update temporary account.");
      return { success: false, error: "Temporary account" };
    }

    try {
      const accountRef = doc(db, "accounts", accountId);

      await updateDoc(accountRef, {
        ...updates,
        lastUpdatedAt: serverTimestamp(),
      });

      console.log("[useUserAccount] Profile updated");
      // alert("✅ Profile updated successfully!");

      return { success: true };
    } catch (error) {
      console.error("[useUserAccount] Error updating profile:", error);
      // alert(`❌ Failed to update profile:\n${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    // State
    loading,
    error,
    accountData,

    // Functions
    processWeChatAccount,
    getAccountById,
    updateUserProfile,
    generateEmailFromWeChatUser,
    checkAccountExists,
  };
};
