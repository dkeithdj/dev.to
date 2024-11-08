/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'sst-blinks',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('Actions');

    api.route('GET /api/donate', {
      handler: 'src/donate.get',
    });
    api.route('OPTIONS /api/donate', {
      handler: 'src/donate.options',
    });
  },
});