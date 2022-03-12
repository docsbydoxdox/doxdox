import renderer from './index';

describe('markdown', () => {
    beforeAll(() => {
        global.Date = class extends Date {
            toDateString() {
                return 'Mock Date';
            }

            toTimeString() {
                return 'Mock Time';
            }
        } as DateConstructor;
    });

    it('render', async () => {
        expect(
            await renderer({
                name: 'doxdox-example',
                description: 'doxdox example description',
                version: '1.0.0',
                files: [
                    {
                        path: 'directory/index.js',
                        methods: [
                            {
                                slug: 'index-js-methodname',
                                name: 'methodName',
                                fullName: 'methodName(param)',
                                description: 'Method description',
                                params: [
                                    {
                                        name: 'param',
                                        description: 'Param description',
                                        types: ['string']
                                    }
                                ],
                                returns: [
                                    {
                                        name: null,
                                        description: 'Return description',
                                        types: ['void']
                                    }
                                ],
                                private: false
                            }
                        ]
                    }
                ]
            })
        ).toMatchSnapshot();
    });
});
