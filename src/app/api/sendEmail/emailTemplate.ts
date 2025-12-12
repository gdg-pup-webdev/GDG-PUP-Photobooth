// GDG Brand Colors
const colors = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

export function getEmailTemplate(recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your GDG Photobooth Photo</title>
  <style>
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 20px 16px !important; }
      .header-padding { padding: 24px 16px 16px 16px !important; }
      .section-padding { padding: 16px !important; }
      .footer-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with GDG Colors -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 6px; background-color: ${
                    colors.blue
                  };"></td>
                  <td width="25%" style="height: 6px; background-color: ${
                    colors.red
                  };"></td>
                  <td width="25%" style="height: 6px; background-color: ${
                    colors.yellow
                  };"></td>
                  <td width="25%" style="height: 6px; background-color: ${
                    colors.green
                  };"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Logo Section -->
          <tr>
            <td align="center" class="header-padding" style="padding: 32px 24px 16px 24px; background-color: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${
                          colors.blue
                        };"></td>
                        <td style="width: 5px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${
                          colors.red
                        };"></td>
                        <td style="width: 5px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${
                          colors.yellow
                        };"></td>
                        <td style="width: 5px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${
                          colors.green
                        };"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 16px 0 0 0; font-size: 24px; font-weight: 800; color: #1a1a1a;">
                GDG PHOTOBOOTH
              </h1>
              <p style="margin: 6px 0 0 0; color: #666666; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">
                Google Developer Groups on Campus PUP
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content-padding" style="padding: 16px 24px 24px 24px; background-color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; border-radius: 12px; border: 1px solid #e8e8e8;">
                <tr>
                  <td class="section-padding" style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 20px; font-weight: 700;">
                      Hey there!
                    </h2>
                    <p style="margin: 0 0 12px 0; color: #333333; font-size: 15px; line-height: 1.5;">
                      Thanks for visiting the <strong style="color: ${
                        colors.blue
                      };">GDG on Campus PUP</strong> Photobooth! We had a blast capturing your moment.
                    </p>
                    <p style="margin: 0 0 16px 0; color: #333333; font-size: 15px; line-height: 1.5;">
                      Your awesome photostrip is attached to this email. Feel free to share it with friends!
                    </p>
                    
                    <!-- Photo Icon -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 16px 0;">
                        
                          <p style="margin: 2px 0 0 0; color: ${
                            colors.green
                          }; font-size: 13px; font-weight: 600;">
                            ✓ Your photostrip is attached!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Hashtags Section -->
          <tr>
            <td class="content-padding" style="padding: 0 24px 24px 24px; background-color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #e8f0fe; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px;" align="center">
                    <p style="margin: 0 0 6px 0; color: #555555; font-size: 13px;">
                      Don't forget to tag us:
                    </p>
                    <p style="margin: 0; font-size: 13px;">
                      <strong style="color: ${colors.blue};">#GDGPUP26</strong>
                      <strong style="color: ${
                        colors.red
                      };">#BeSuperWithGDG</strong>
                      <strong style="color: ${
                        colors.green
                      };">#LevelUpWithSparky</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="padding: 20px 24px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width: 6px; height: 6px; border-radius: 50%; background-color: ${
                          colors.blue
                        };"></td>
                        <td style="width: 4px;"></td>
                        <td style="width: 6px; height: 6px; border-radius: 50%; background-color: ${
                          colors.red
                        };"></td>
                        <td style="width: 4px;"></td>
                        <td style="width: 6px; height: 6px; border-radius: 50%; background-color: ${
                          colors.yellow
                        };"></td>
                        <td style="width: 4px;"></td>
                        <td style="width: 6px; height: 6px; border-radius: 50%; background-color: ${
                          colors.green
                        };"></td>
                      </tr>
                    </table>
                    <p style="margin: 12px 0 0 0; color: #666666; font-size: 11px;">
                      Powered by <strong style="color: #333333;">GDG on Campus PUP</strong>
                    </p>
                    <p style="margin: 6px 0 0 0; color: #888888; font-size: 10px;">
                      Sent to ${recipientEmail}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Bottom Color Bar -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 4px; background-color: ${
                    colors.blue
                  };"></td>
                  <td width="25%" style="height: 4px; background-color: ${
                    colors.red
                  };"></td>
                  <td width="25%" style="height: 4px; background-color: ${
                    colors.yellow
                  };"></td>
                  <td width="25%" style="height: 4px; background-color: ${
                    colors.green
                  };"></td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Legal Footer -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table">
          <tr>
            <td align="center" style="padding: 20px 16px;">
              <p style="margin: 0; color: #888888; font-size: 10px; line-height: 1.4;">
                © ${new Date().getFullYear()} Google Developer Groups on Campus PUP. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
