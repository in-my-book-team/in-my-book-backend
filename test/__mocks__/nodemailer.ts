exports.createTransport = jest.fn().mockReturnValue({
  sendMail: jest.fn().mockResolvedValue('Email sent successfully'),
});
