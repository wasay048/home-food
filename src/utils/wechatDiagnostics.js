/**
 * WeChat Domain Verification Utility
 * Programmatic testing functions for WeChat authentication setup
 */

export class WeChatDiagnostics {
  constructor() {
    this.domain = "homefreshfoods.ai";
    this.appId = "wx4a71fe09bb125182";
    this.redirectUri = `https://${this.domain}/wechat/callback`;
    this.results = {
      timestamp: new Date().toISOString(),
      domain: this.domain,
      appId: this.appId,
      tests: {},
    };
  }

  async runAllTests() {
    console.log("🔍 Starting WeChat diagnostics...");

    try {
      this.results.tests.domainAccess = await this.testDomainAccess();
      this.results.tests.verificationFile = await this.testVerificationFile();
      this.results.tests.sslCertificate = await this.testSSLCertificate();
      this.results.tests.redirectAccess = await this.testRedirectAccess();
      this.results.tests.authUrl = this.generateAuthUrl();

      // Calculate overall status
      const passed = Object.values(this.results.tests).filter(
        (test) => test.success
      ).length;
      const total = Object.keys(this.results.tests).length - 1; // Exclude authUrl which is always generated

      this.results.overall = {
        success: passed === total,
        score: `${passed}/${total}`,
        message:
          passed === total
            ? "All tests passed!"
            : "Some tests failed - check WeChat Console configuration",
      };

      console.log("✅ Diagnostics complete:", this.results);
      return this.results;
    } catch (error) {
      console.error("❌ Diagnostics failed:", error);
      this.results.error = error.message;
      return this.results;
    }
  }

  async testDomainAccess() {
    const test = {
      name: "Domain Access",
      success: false,
      message: "",
      url: `https://${this.domain}/`,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(test.url, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        test.success = true;
        test.message = `Domain ${this.domain} is accessible`;
        test.status = response.status;
      } else {
        test.message = `HTTP ${response.status}: ${response.statusText}`;
        test.status = response.status;
      }
    } catch (error) {
      test.message = `Connection failed: ${error.message}`;
      test.error = error.name;
    }

    return test;
  }

  async testVerificationFile() {
    const test = {
      name: "Verification File",
      success: false,
      message: "",
      checkedFiles: [],
    };

    const possibleFiles = [
      "MP_verify_placeholder.txt",
      `MP_verify_${this.appId}.txt`,
      "MP_verify_wx4a71fe09bb125182.txt",
    ];

    for (const filename of possibleFiles) {
      const url = `https://${this.domain}/${filename}`;
      test.checkedFiles.push(filename);

      try {
        const response = await fetch(url);
        if (response.ok) {
          const content = await response.text();
          test.success = true;
          test.message = `Found verification file: ${filename}`;
          test.filename = filename;
          test.content = content.substring(0, 100);
          test.url = url;
          break;
        }
      } catch (error) {
        // Continue checking other files
      }
    }

    if (!test.success) {
      test.message =
        "No verification file found. Upload MP_verify_*.txt from WeChat Console";
      test.recommendation =
        "Download verification file from WeChat Developer Console and upload to website root";
    }

    return test;
  }

  async testSSLCertificate() {
    const test = {
      name: "SSL Certificate",
      success: false,
      message: "",
      url: `https://${this.domain}/`,
    };

    try {
      const response = await fetch(test.url, { method: "HEAD" });

      if (response.ok) {
        test.success = true;
        test.message = "Valid HTTPS connection established";
        test.protocol = "HTTPS";
      } else {
        test.message = `HTTPS connection established but got HTTP ${response.status}`;
        test.protocol = "HTTPS";
        test.status = response.status;
      }
    } catch (error) {
      test.message = `SSL/HTTPS error: ${error.message}`;
      test.error = error.name;
    }

    return test;
  }

  async testRedirectAccess() {
    const test = {
      name: "Redirect URI Access",
      success: false,
      message: "",
      url: this.redirectUri,
    };

    try {
      const response = await fetch(this.redirectUri, { method: "HEAD" });

      // For callback endpoints, 404 or 405 might be expected if no code is provided
      if (response.ok || response.status === 404 || response.status === 405) {
        test.success = true;
        test.message = `Redirect URI is accessible (HTTP ${response.status})`;
        test.status = response.status;
      } else {
        test.message = `Redirect URI returned HTTP ${response.status}`;
        test.status = response.status;
      }
    } catch (error) {
      test.message = `Redirect URI test failed: ${error.message}`;
      test.error = error.name;
    }

    return test;
  }

  generateAuthUrl(state = null) {
    const testState =
      state || `test_${Math.random().toString(36).substring(7)}`;

    const params = new URLSearchParams({
      appid: this.appId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "snsapi_base",
      state: testState,
    });

    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;

    return {
      name: "Auth URL Generation",
      success: true,
      message: "WeChat OAuth URL generated successfully",
      url: authUrl,
      state: testState,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        authUrl
      )}`,
    };
  }

  getWeChatConsoleChecklist() {
    return {
      title: "WeChat Developer Console Checklist",
      url: "https://developers.weixin.qq.com/",
      steps: [
        {
          step: 1,
          action: "Login to WeChat Developer Console",
          url: "https://developers.weixin.qq.com/",
          status: "manual",
        },
        {
          step: 2,
          action: "Navigate to Development Configuration (开发配置) tab",
          description:
            "Click on the Development Configuration tab in your app dashboard",
          status: "manual",
        },
        {
          step: 3,
          action: "Find Web Authorization Domain (网页授权域名) section",
          description:
            "Look for the Web Authorization Domain configuration area",
          status: "critical",
        },
        {
          step: 4,
          action: `Verify ${this.domain} is listed and verified`,
          description: `Ensure ${this.domain} appears in the authorized domains list with verified status`,
          status: "critical",
        },
        {
          step: 5,
          action: "Check verification file accessibility",
          description: `Ensure MP_verify_*.txt file is uploaded and accessible at https://${this.domain}/MP_verify_*.txt`,
          status: "critical",
        },
        {
          step: 6,
          action: 'Verify domain status is "Verified" or "Active"',
          description: "Domain status should show as verified, not pending",
          status: "critical",
        },
      ],
      commonIssues: [
        `Domain ${this.domain} not added to Web Authorization Domain list`,
        "Verification file missing or inaccessible",
        "Domain added but not verified (still pending)",
        "Wrong verification file uploaded",
        "HTTPS not properly configured",
      ],
    };
  }

  generateReport() {
    const report = {
      ...this.results,
      checklist: this.getWeChatConsoleChecklist(),
      recommendations: [],
      nextSteps: [],
    };

    // Generate recommendations based on test results
    if (!this.results.tests.domainAccess?.success) {
      report.recommendations.push("Fix domain accessibility issues");
      report.nextSteps.push("Check DNS configuration and hosting setup");
    }

    if (!this.results.tests.verificationFile?.success) {
      report.recommendations.push("Upload WeChat verification file");
      report.nextSteps.push(
        "Download MP_verify_*.txt from WeChat Console and upload to website root"
      );
    }

    if (!this.results.tests.sslCertificate?.success) {
      report.recommendations.push("Fix SSL certificate issues");
      report.nextSteps.push(
        "Ensure HTTPS is properly configured for the domain"
      );
    }

    if (report.recommendations.length === 0) {
      report.recommendations.push(
        "All technical tests passed - check WeChat Console configuration"
      );
      report.nextSteps.push(
        "Verify domain is added to Web Authorization Domain list in WeChat Console"
      );
    }

    return report;
  }
}

// Convenience functions for easy testing
export const runWeChatDiagnostics = async () => {
  const diagnostics = new WeChatDiagnostics();
  return await diagnostics.runAllTests();
};

export const checkWeChatDomain = async () => {
  const diagnostics = new WeChatDiagnostics();
  await diagnostics.runAllTests();
  const report = diagnostics.generateReport();

  console.group("🔍 WeChat Domain Verification Report");
  console.log("Overall Status:", report.overall);
  console.log("Test Results:", report.tests);
  console.log("Recommendations:", report.recommendations);
  console.log("Next Steps:", report.nextSteps);
  console.groupEnd();

  return report;
};

// Browser console helper
if (typeof window !== "undefined") {
  window.WeChatDiagnostics = WeChatDiagnostics;
  window.runWeChatDiagnostics = runWeChatDiagnostics;
  window.checkWeChatDomain = checkWeChatDomain;
}
