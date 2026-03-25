import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
        backgroundColor: "#f4f4f4",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        .pp-container { max-width: 1400px; padding: 48px; }
        .pp-container .main-heading { font-size: 22px; margin-bottom: 16px; color: #111; }
        .pp-container h2, .pp-container h3 { color: #111; font-size: 16px; }
        .pp-container p { margin-bottom: 10px; font-size: 12px; }
        .pp-container ul { list-style-type: disc; margin-left: 20px; }
        .pp-container ul li { font-size: 12px; margin-bottom: 12px; }
        .pp-container a { color: #354e69; text-decoration: underline; text-transform: capitalize; font-size: 12px; }
        .pp-container a:hover { text-decoration: underline; }
        @media (max-width: 768px) {
          .pp-container .main-heading { font-size: 20px; margin-bottom: 16px; color: #111; }
          .pp-container { padding: 24px; }
        }
      `}</style>
      <div className="pp-container">
        <header>
          <h1 className="main-heading">HomeFresh PRIVACY POLICY</h1>
          <p>Last updated February 15, 2025</p>
        </header>

        <section>
          <p>
            This Privacy Notice for HomeFresh ("we," "us," or "our"), describes
            how and why we might access, collect, store, use, and/or share
            ("process") your personal information when you use our services
            ("Services"), including when you:
          </p>
          <ul>
            <li>
              Download and use our mobile application (HomeFresh), or any other
              application of ours that links to this Privacy Notice
            </li>
            <li>
              Use HomeFresh. The HomeFresh App connects the Microenterprise Home
              Kitchens and other food providers with customers who are interested
              in high-quality foods. HomeFresh App provides features and services
              that:
              <ul>
                <li>
                  enable the customers to find options of delicious &amp;
                  affordable foods offered by the local food enterprises,
                </li>
                <li>
                  help the food providers build an online catalog of their dishes
                  with customer reviews, and
                </li>
                <li>
                  help the food providers manage their food orders and automate
                  the payment transactions.
                </li>
              </ul>
            </li>
            <li>
              Engage with us in other related ways, including any sales,
              marketing, or events
            </li>
          </ul>
          <p>
            Questions or concerns? Reading this Privacy Notice will help you
            understand your privacy rights and choices. We are responsible for
            making decisions about how your personal information is processed. If
            you do not agree with our policies and practices, please do not use
            our Services. If you still have any questions or concerns, please
            contact us at{" "}
            <a href="mailto:HomeFreshcalifornia@gmail.com">
              HomeFreshcalifornia@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2>SUMMARY OF KEY POINTS</h2>
          <p>
            This summary provides key points from our Privacy Notice, but you
            can find out more details about any of these topics by reviewing the
            following summary of key points or reading the TABLE OF CONTENTS
            following this summary.
          </p>
          <ul>
            <li>
              <strong>What personal information do we process?</strong> We may
              process personal information depending on how you interact with us
              and the Services.
            </li>
            <li>
              <strong>Do we process any sensitive personal information?</strong>{" "}
              We do not process sensitive personal information.
            </li>
            <li>
              <strong>
                Do we collect any information from third parties?
              </strong>{" "}
              We do not collect any information from third parties.
            </li>
            <li>
              <strong>How do we process your information?</strong> We process
              your information to provide, improve, and administer our Services,
              communicate with you, for security and fraud prevention, and to
              comply with the law.
            </li>
            <li>
              <strong>
                In what situations and with which parties do we share personal
                information?
              </strong>{" "}
              We may share information in specific situations and with specific
              third parties, such as using AI services to improve user
              interaction.
            </li>
            <li>
              <strong>How do we keep your information safe?</strong> We have
              organizational and technical processes to protect your personal
              information, but cannot guarantee it will be 100% secure.
            </li>
            <li>
              <strong>
                What are your rights and How do you exercise your rights?
              </strong>{" "}
              Depending on where you are located, you have certain rights
              regarding your personal information. You can exercise these rights
              by contacting us.
            </li>
          </ul>
        </section>

        <section>
          <h2>TABLE OF CONTENTS</h2>
          <ul>
            <li><a href="#what-information">1. WHAT INFORMATION DO WE COLLECT?</a></li>
            <li><a href="#how-do-we-process">2. HOW DO WE PROCESS YOUR INFORMATION?</a></li>
            <li><a href="#when-and-with-whom">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
            <li><a href="#sms-communications">4. SMS COMMUNICATIONS</a></li>
            <li><a href="#how-long-do-we-keep">5. HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
            <li><a href="#how-do-we-keep-safe">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
            <li><a href="#do-we-collect-from-minors">7. DO WE COLLECT INFORMATION FROM MINORS?</a></li>
            <li><a href="#what-are-your-privacy-rights">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
            <li><a href="#controls-for-do-not-track">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
            <li><a href="#do-us-residents-have-rights">10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
            <li><a href="#do-we-make-updates">11. DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
            <li><a href="#how-can-you-contact">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
            <li><a href="#how-can-you-review">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
          </ul>
        </section>

        <section id="what-information">
          <h3>1. WHAT INFORMATION DO WE COLLECT?</h3>
          <p><strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us.</p>
          <p><strong>Personal Information Provided by You:</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use.</p>
          <ul>
            <li>Usernames</li>
            <li>Passwords</li>
            <li>Email addresses</li>
            <li>Phone numbers</li>
          </ul>
        </section>

        <section id="how-do-we-process">
          <h3>2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
          <p>We process your personal information for a variety of reasons, including to facilitate account creation and authentication, to deliver services to users, and for fraud prevention.</p>
        </section>

        <section id="when-and-with-whom">
          <h3>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h3>
          <p>We may need to share your personal information in specific situations, such as business transfers or with service providers.</p>
        </section>

        <section id="sms-communications">
          <h3>4. SMS COMMUNICATIONS</h3>
          <p>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Mobile opt-in data and consent will not be shared with any third parties. Information sharing to subcontractors in support services such as customer service is permitted.</p>
          <p>By opting in to SMS communications from HomeFresh, you consent to receive order confirmation and delivery status text messages. Message frequency varies per order. Message and data rates may apply. Reply STOP to unsubscribe at any time. Reply HELP for help, or visit <a href="https://www.homefreshfoods.ai">homefreshfoods.ai</a>.</p>
        </section>

        <section id="how-long-do-we-keep">
          <h3>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice.</p>
        </section>

        <section id="how-do-we-keep-safe">
          <h3>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
          <p>We have implemented reasonable technical and organizational security measures to protect your personal information, but no system can be completely secure.</p>
        </section>

        <section id="do-we-collect-from-minors">
          <h3>7. DO WE COLLECT INFORMATION FROM MINORS?</h3>
          <p>We do not knowingly collect, solicit data from, or market to children under 18 years of age.</p>
        </section>

        <section id="what-are-your-privacy-rights">
          <h3>8. WHAT ARE YOUR PRIVACY RIGHTS?</h3>
          <p>You may review, change, or terminate your account at any time. You can also withdraw consent to process your personal information.</p>
        </section>

        <section id="controls-for-do-not-track">
          <h3>9. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
          <p>We do not currently respond to "Do-Not-Track" signals, but this may change in the future.</p>
        </section>

        <section id="do-us-residents-have-rights">
          <h3>10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
          <p>If you are a resident of certain US states, you may have specific privacy rights, including the right to access, correct, or delete your personal information.</p>
        </section>

        <section id="do-we-make-updates">
          <h3>11. DO WE MAKE UPDATES TO THIS NOTICE?</h3>
          <p>Yes, we may update this Privacy Notice to stay compliant with relevant laws. The updated version will be indicated by a revised date at the top of the notice.</p>
        </section>

        <section id="how-can-you-contact">
          <h3>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h3>
          <p>If you have questions or comments about this notice, you can email us at <a href="mailto:HomeFreshcalifornia@gmail.com">HomeFreshcalifornia@gmail.com</a>.</p>
        </section>

        <section id="how-can-you-review">
          <h3>13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h3>
          <p>You can request access to, or deletion of your personal data, by contacting us via the provided email.</p>
        </section>
      </div>
    </div>
  );
}
