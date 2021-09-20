import { Common } from '../../..'
import { prismicQueryResponse } from '../../support/prismicFactory'
const PrismicHelper = Common.Helpers.Prismic
describe('Helper: Prismic (parser)', () => {
  describe('Default settings', () => {
    const prismic = new PrismicHelper({ prismicQueryResponse: prismicQueryResponse() })
    prismic.parse()
    it('throws an error if payload is incorrect', async () => {
      const other = new PrismicHelper({ prismicQueryResponse: {} })
      expect(() => other.parse()).toThrowError('Prismic query response is invalid')
    })
    it('gets layout', () => {
      const layout = prismic.getContentType('spa_master')
      expect(layout).toBeDefined()
      expect(Array.isArray(layout)).toBeTruthy()
      if (layout !== null) { 
        expect(layout.length).toEqual(1)
        expect(layout[0].layout).toBeTruthy()
      }
    })
    it('returns a static component from layout', () => {
      const comp = prismic.getStaticComponentFromLayout('spa_master', 'website_name')
      expect(comp).toBeDefined()
      expect(comp).toEqual({
        label: 'website_name',
        component: 'htmlTextComponent',
        slice: null,
        body: { tag: 'h1', spans: [] }
      })
    })
    it('returns a static component from slice', () => {
      const comp = prismic.getStaticComponentFromSlice('spa_master', 'masthead', 'rich_example')
      expect(comp).toBeDefined()
      expect(comp).toEqual({
        label: 'rich_example',
        slice: 'masthead',
        component: 'complexComponent',
        body: [{
          label: 'rich_example_0',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: [
              {
                start: 256,
                end: 322,
                type: 'strong'
              },
              {
                start: 338,
                end: 367,
                type: 'em'
              },
              {
                start: 520,
                end: 545,
                type: 'hyperlink',
                data: {
                  link_type: 'Web',
                  url: 'https:
                }
              },
              {
                start: 565,
                end: 584,
                type: 'hyperlink',
                data: {
                  link_type: 'Web',
                  url: 'https:
                }
              }
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_1',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: [
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_2',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: [
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_3',
          slice: 'masthead',
          body: null,
          component: null
        },
        {
          label: 'rich_example_4',
          slice: 'masthead',
          body: null,
          component: null
        },
        {
          label: 'rich_example_5',
          slice: 'masthead',
          body: null,
          component: null
        },
        {
          label: 'rich_example_6',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: [
              {
                start: 131,
                end: 151,
                type: 'hyperlink',
                data: {
                  link_type: 'Media',
                  name: 'example.jpg',
                  kind: 'image',
                  url: 'https:
                  size: '115450',
                  height: '400',
                  width: '400'
                }
              }
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_7',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_8',
          slice: 'masthead',
          body: {
            tag: 'ul',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_9',
          slice: 'masthead',
          body: {
            tag: 'ul',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_10',
          slice: 'masthead',
          body: {
            tag: 'ul',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_11',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_12',
          slice: 'masthead',
          body: {
            tag: 'h3',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_13',
          slice: 'masthead',
          body: {
            src: 'https:
            alt: '',
            dimensions: {
              width: 400,
              height: 400
            }
          },
          component: 'imageComponent'
        },
        {
          label: 'rich_example_14',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: [
              {
                start: 167,
                end: 183,
                type: 'strong'
              }
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_15',
          slice: 'masthead',
          body: {
            tag: 'h2',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_16',
          slice: 'masthead',
          body: {
            tag: 'p',
            spans: []
          },
          component: 'htmlTextComponent'
        }
        ]
      })
    })
    it('gets a slice from layout with static component', () => {
      expect(prismic.getSlice('spa_master', 'header')).toEqual({
        static: [
          {
            label: 'header_logo',
            component: 'imageComponent',
            slice: 'header',
            body: {
              src: 'https:
              alt: '',
              dimensions: {
                height: 76,
                width: 1018
              },
              copyright: undefined
            }
          }
        ],
        repeatable: [[]]
      })
    })
    it('returns `null` if a slice is not found', () => {
      expect(prismic.getSlice('spa_master', 'nonexisting')).toBeNull()
    })
    it('returns `null` if a layout is not found', () => {
      expect(prismic.getSlice('nonexisting', 'header')).toBeNull()
    })
    it('returns `null` if a content type is not a layout', () => {
      expect(prismic.getSlice('testrepeatabletype', 'header')).toBeNull()
    })
    it('returns `null` if repeatable content type not found', () => {
      expect(prismic.getContentType('something')).toBeNull()
    })
    it('gets a slice from layout with repeatable components', () => {
      expect(prismic.getSlice('spa_master', 'section_3')).toEqual({
        static: [
          {
            label: 'section_title',
            component: 'htmlTextComponent',
            slice: 'section_3',
            body: {
              tag: 'h2',
              spans: []
            }
          }
        ],
        repeatable: [
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Reception Year 1-2'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Year 3-4'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Year 5-6'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Year 7-9'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'GCSE'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'A-Level'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Examps focused'
              }
            }
          ],
          [
            {
              label: 'tile_picture',
              component: 'imageComponent',
              slice: 'section_3',
              body: {
                src: 'https:
                alt: '',
                copyright: undefined,
                dimensions: {
                  width: 400,
                  height: 400
                }
              }
            },
            {
              label: 'tile_title',
              component: 'textComponent',
              slice: 'section_3',
              body: {
                text: 'Learn new skills'
              }
            }
          ]
        ]
      })
    })
    it('gets repeatable content type with multiple instances', () => {
      expect(prismic.getContentType('testrepeatabletype')).toEqual([
        {
          id: 'XrqaKhEAAJq3zU9q',
          lang: 'en-gb',
          last_publication: '2020-05-12T12:44:28+0000',
          layout: false,
          slices: [],
          type: 'testrepeatabletype',
          components: [
            {
              component: 'htmlTextComponent',
              label: 'title',
              slice: null,
              body: {
                spans: [],
                tag: 'h1'
              }
            },
            {
              component: 'htmlTextComponent',
              label: 'subtitle',
              slice: null,
              body: {
                spans: [],
                tag: 'h3'
              }
            }
          ]
        },
        {
          id: 'XrqaFBEAACMAzU8F',
          lang: 'en-gb',
          last_publication: '2020-05-12T12:44:15+0000',
          layout: false,
          slices: [],
          type: 'testrepeatabletype',
          components: [
            {
              component: 'htmlTextComponent',
              label: 'title',
              slice: null,
              body: {
                spans: [],
                tag: 'h1'
              }
            }
          ]
        }
      ])
    })
  })
  describe('User settings', () => {
    it.skip('defines layout according to a user custom pattern', () => {
    })
    it.skip('defines and uses custom converter functions for user convenience', () => {
    })
  })
})
