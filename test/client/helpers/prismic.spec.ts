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
        component: 'htmlInlineComponent',
        slice: null,
        body: { tag: 'h1', spans: [] }
      })
    })
    it('returns a static component from slice', () => {
      const comp = prismic.getStaticComponentFromSlice('spa_master', 'header', 'header_logo')
      expect(comp).toBeDefined()
      expect(comp).toEqual({
        label: 'header_logo',
        component: 'imageComponent',
        slice: 'header',
        body: {
          src: 'https:
          alt: '',
          dimensions: { width: 1018, height: 76 },
          copyright: undefined
        }
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
        repeatable: [ [] ]
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
            component: 'htmlInlineComponent',
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
              component: 'htmlInlineComponent',
              label: 'title',
              slice: null,
              body: {
                spans: [],
                tag: 'h1'
              }
            },
            {
              component: 'htmlInlineComponent',
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
              component: 'htmlInlineComponent',
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
