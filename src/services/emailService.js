import html2pdf from 'html2pdf.js';

export const sendDietPlanEmail = async (email, htmlContent, patientName) => {
  try {
    console.log('Starting email process for:', email);
    console.log('Generating PDF...');
    
    // Generate PDF from HTML content
    const pdfBlob = await html2pdf()
      .from(htmlContent)
      .outputPdf('blob');
    
    console.log('PDF generated successfully');

    // Create FormData object
    const formData = new FormData();
    const file = new Blob([pdfBlob], { type: 'application/pdf' });
    formData.append('pdf', file, `${patientName}_Diet_Plan.pdf`);
    formData.append('email', email);
    formData.append('subject', `Diet Plan for ${patientName}`);
    formData.append('message', `Please find attached the diet plan for ${patientName}.`);

    console.log('Sending request to backend...', {
      email,
      fileName: `${patientName}_Diet_Plan.pdf`,
      fileSize: file.size
    });

    // Send to your backend API
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const responseData = await response.text();
    console.log('Response data:', responseData);

    if (!response.ok) {
      throw new Error(`Failed to send email: ${responseData}`);
    }

    return response;
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    throw error;
  }
};