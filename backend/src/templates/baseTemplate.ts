export const baseTemplate = (content: string, title = "Anastasia Massage"): string => {
    return `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f8f8f8;
            color: #333;
            padding: 2rem;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 0 8px rgba(0,0,0,0.05);
          }
          .footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${content}
          <div class="footer">
            © ${new Date().getFullYear()} Anastasia Massage – Alle Rechte vorbehalten.
          </div>
        </div>
      </body>
      </html>
    `;
  };
  