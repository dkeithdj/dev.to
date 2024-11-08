//...
  async run() {
    const api = new sst.aws.ApiGatewayV2('Actions');

    api.route('GET /api/donate', {
      handler: 'src/donate.get',
    });
    api.route('OPTIONS /api/donate', {
      handler: 'src/donate.options',
    });
    api.route('POST /api/donate/{amount}', { handler: 'src/donate.post' });
  },
//...
