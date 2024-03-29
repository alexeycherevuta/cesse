import { prismicQueryResponse, prismicQueryWithRepeatableResponse } from '../factory'
import PrismicParser from '../modules/parser'
describe('Plugin: Prismic → Parser', () => {
  describe('default settings', () => {
    const prismic = new PrismicParser({ prismicQueryResponse: prismicQueryResponse() })
    prismic.parse()
    it('throws an error if payload is incorrect', async () => {
      const other = new PrismicParser({ prismicQueryResponse: {} })
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
      const comp = prismic.getComponentFromLayout('spa_master', 'website_name')
      expect(comp).toBeDefined()
      expect(comp).toEqual({
        label: 'website_name',
        component: 'htmlTextComponent',
        slice: null,
        firstOfKind: true,
        lastOfKind: true,
        body: { tag: 'h1', spans: [], text: 'fake people' }
      })
    })
    it('returns a static component from slice', () => {
      const comp = prismic.getComponentFromSlice('spa_master', 'masthead', 'rich_example')
      expect(comp).toBeDefined()
      expect(comp).toEqual({
        label: 'rich_example',
        slice: 'masthead',
        component: 'richComponent',
        firstOfKind: true,
        lastOfKind: true,
        body: [{
          label: 'rich_example_0',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: false,
          body: {
            tag: 'p',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu finibus nibh. Nullam sagittis nulla odio, vitae lobortis lorem lacinia vel. Nam ac dui vitae ligula malesuada sollicitudin. Duis urna neque, accumsan vel est nec, rhoncus efficitur libero. Cras at venenatis nisi. Sed ornare ipsum a sem tristique tristique. Cras blandit scelerisque magna nec pharetra. Aenean augue nisl, porttitor a sem finibus, posuere mattis leo. Pellentesque ultricies dapibus porta. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse blandit, metus sit amet malesuada placerat, dui elit rhoncus nibh, vel pellentesque nisi eros eget tellus.',
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
          firstOfKind: false,
          lastOfKind: false,
          body: {
            tag: 'p',
            text: 'Vestibulum congue risus sed lorem scelerisque mattis. In dictum commodo augue, id eleifend nulla. Nulla facilisi. Phasellus nec lacinia tortor, sed cursus lectus. ',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_2',
          slice: 'masthead',
          firstOfKind: false,
          lastOfKind: true,
          body: {
            tag: 'p',
            text: 'Nunc hendrerit nibh a dolor tincidunt,',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_3',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: false,
          body: {
            tag: 'ol',
            text: 'num 1 volutpat vehicula',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_4',
          slice: 'masthead',
          firstOfKind: false,
          lastOfKind: false,
          body: {
            tag: 'ol',
            text: 'num 2 felis posuere.',
            spans: [
              {
                end: 19,
                start: 5,
                type: 'strong'
              }
            ]
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_5',
          slice: 'masthead',
          firstOfKind: false,
          lastOfKind: true,
          body: {
            tag: 'ol',
            text: 'num 3 super nice',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_6',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: false,
          body: {
            tag: 'p',
            text: 'Vivamus nec tempor ipsum, ac luctus risus. Sed congue, augue mattis ultrices consequat, risus erat suscipit enim, elementum mollis nisl velit eget nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce sit amet sapien ac velit accumsan facilisis non nec tellus.',
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
          firstOfKind: false,
          lastOfKind: true,
          body: {
            tag: 'p',
            text: 'Other list:',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_8',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: false,
          body: {
            tag: 'ul',
            text: 'element 1',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_9',
          slice: 'masthead',
          firstOfKind: false,
          lastOfKind: false,
          body: {
            tag: 'ul',
            text: 'element 2',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_10',
          slice: 'masthead',
          firstOfKind: false,
          lastOfKind: true,
          body: {
            tag: 'ul',
            text: 'element 3',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_11',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: true,
          body: {
            tag: 'p',
            text: 'Curabitur quis rutrum tortor, eget ornare ante. Aenean congue molestie ullamcorper. Nullam ut ante ac leo ornare finibus sit amet eu ipsum. Integer eu semper est.',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_12',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: true,
          body: {
            tag: 'h3',
            text: 'Nice title heading',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_13',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: true,
          body: {
            src: 'https:
            alt: '',
            copyright: undefined,
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
          firstOfKind: true,
          lastOfKind: true,
          body: {
            tag: 'p',
            text: ' Proin pharetra dui sit amet efficitur laoreet. Praesent augue velit, commodo vel suscipit placerat, commodo et leo. Suspendisse lacinia nec dolor facilisis elementum. Nulla facilisi. Quisque tincidunt dui eros, dapibus vehicula nulla egestas a. Suspendisse potenti. Donec sed ipsum risus. Nam tincidunt tortor orci, ac elementum nulla tincidunt a. ',
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
          firstOfKind: true,
          lastOfKind: true,
          body: {
            tag: 'h2',
            text: 'Another bigger heading',
            spans: []
          },
          component: 'htmlTextComponent'
        },
        {
          label: 'rich_example_16',
          slice: 'masthead',
          firstOfKind: true,
          lastOfKind: true,
          body: {
            tag: 'p',
            text: 'Phasellus elementum massa lorem, vitae facilisis quam congue in. Nam condimentum lobortis odio sit amet sollicitudin.',
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
            firstOfKind: true,
            lastOfKind: true,
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
            firstOfKind: true,
            lastOfKind: true,
            body: {
              tag: 'h2',
              text: '1:few group sessions for',
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
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
              firstOfKind: true,
              lastOfKind: true,
              body: {
                spans: [],
                text: 'transname2',
                tag: 'h1'
              }
            },
            {
              component: 'htmlTextComponent',
              label: 'subtitle',
              slice: null,
              firstOfKind: true,
              lastOfKind: true,
              body: {
                spans: [],
                text: 'transnamesdsddsds2',
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
              firstOfKind: true,
              lastOfKind: true,
              body: {
                spans: [],
                text: 'transname1',
                tag: 'h1'
              }
            }
          ]
        }
      ])
    })
    it('returns multiple components within a repeatable component', () => {
      const otherPrismic = new PrismicParser({ prismicQueryResponse: prismicQueryWithRepeatableResponse() })
      otherPrismic.parse()
      expect(otherPrismic.getContentType('page')).toEqual([
        {
           id: 'XsLG1hEAAJLD8SOJ',
           type: 'page',
           layout: false,
           last_publication: '2020-05-21T11:01:38+0000',
           lang: 'en-gb',
           slices: [],
           components: [
              {
                 label: 'page_title',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    tag: 'h1',
                    text: '1 : 1 tuition',
                    spans: []
                 },
                 component: 'htmlTextComponent'
              },
              {
                 label: 'page_reference',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'pageOneToOne'
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_banner',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    src: 'https:
                    alt: '',
                    dimensions: {
                       width: 1600,
                       height: 503
                    }
                 },
                 component: 'imageComponent'
              },
              {
                 label: 'page_content',
                 slice: '',
                 component: 'richComponent',
                 firstOfKind: true,
                 lastOfKind: true,
                 body: [
                    {
                       label: 'page_content_0',
                       slice: '',
                       firstOfKind: true,
                       lastOfKind: true,
                       body: {
                          tag: 'h3',
                          text: 'Boost attainment and grades with our trusted people',
                          spans: []
                       },
                       component: 'htmlTextComponent'
                    },
                    {
                       label: 'page_content_1',
                       slice: '',
                       firstOfKind: true,
                       lastOfKind: true,
                       body: {
                          tag: 'p',
                          text: 'Whatever the level, age or ability, from early years to A Level and SEN, our people have got the curriculum covered. With prices per session starting from £20 per hour, 1 : 1 tuition from our fully qualified teachers can provide a huge boost to attainment levels and exam results. ',
                          spans: []
                       },
                       component: 'htmlTextComponent'
                    },
                    {
                       label: 'page_content_2',
                       slice: '',
                       firstOfKind: true,
                       lastOfKind: true,
                       body: {
                          tag: 'h3',
                          text: 'Face-to-face',
                          spans: []
                       },
                       component: 'htmlTextComponent'
                    }
                 ]
              },
              {
                 label: 'page_button_label',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: ''
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_button_link',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: null,
                 component: null
              },
              {
                 label: 'page_quote',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'I was really pleased with'
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_quote_author',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'Rebecca, Liverpool April 2020'
                 },
                 component: 'textComponent'
              }
           ]
        },
        {
           id: 'XsLH7REAAGrD8SiK',
           type: 'page',
           layout: false,
           last_publication: '2020-05-21T10:57:43+0000',
           lang: 'en-gb',
           slices: [],
           components: [
              {
                 label: 'page_title',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    tag: 'h1',
                    text: 'Safeguarding',
                    spans: []
                 },
                 component: 'htmlTextComponent'
              },
              {
                 label: 'page_reference',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'pageSafeguarding'
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_banner',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    src: 'https:
                    alt: '',
                    dimensions: {
                       width: 1600,
                       height: 503
                    }
                 },
                 component: 'imageComponent'
              },
              {
                 label: 'page_content',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    tag: 'p',
                    text: 'All of our people undergo stringent vetting procedures, so you can rest assured we uphold the highest possible safeguarding standards. All people undergo the following checks and vetting:',
                    spans: []
                 },
                 component: 'htmlTextComponent'
              },
              {
                 label: 'page_button_label',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: ''
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_button_link',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: null,
                 component: null
              },
              {
                 label: 'page_quote',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'I was '
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_quote_author',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'Rebecca, Liverpool April 2020'
                 },
                 component: 'textComponent'
              }
           ]
        },
        {
           id: 'XsLHsREAAJLD8Sd-',
           type: 'page',
           layout: false,
           last_publication: '2020-05-21T10:58:15+0000',
           lang: 'en-gb',
           slices: [],
           components: [
              {
                 label: 'page_title',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    tag: 'h1',
                    text: '1 : few group tuition',
                    spans: []
                 },
                 component: 'htmlTextComponent'
              },
              {
                 label: 'page_reference',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'pageOneToFew'
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_banner',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    src: 'https:
                    alt: '',
                    dimensions: {
                       width: 1600,
                       height: 503
                    }
                 },
                 component: 'imageComponent'
              },
              {
                 label: 'page_content',
                 slice: '',
                 component: 'richComponent',
                 firstOfKind: true,
                 lastOfKind: true,
                 body: [
                    {
                       label: 'page_content_0',
                       slice: '',
                       firstOfKind: true,
                       lastOfKind: true,
                       body: {
                          tag: 'p',
                          text: 'Joining a small, select group of 3-4 other pupils, our group sessions are a brilliant, cost-effective way to boost learning. Interactive and fun by being able to engage with other pupils, these sessions are sure to help with confidence and have been created with clear learning outcomes.',
                          spans: []
                       },
                       component: 'htmlTextComponent'
                    },
                    {
                       label: 'page_content_1',
                       slice: '',
                       firstOfKind: true,
                       lastOfKind: true,
                       body: {
                          tag: 'h4',
                          text: 'Free taster session! If you like the session and would like to book further sessions they are £17.99 thereafter on a pay as you go basis.',
                          spans: []
                       },
                       component: 'htmlTextComponent'
                    }
                 ]
              },
              {
                 label: 'page_button_label',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: ''
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_button_link',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: null,
                 component: null
              },
              {
                 label: 'page_quote',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'I was really pleased'
                 },
                 component: 'textComponent'
              },
              {
                 label: 'page_quote_author',
                 slice: null,
                 firstOfKind: true,
                 lastOfKind: true,
                 body: {
                    text: 'Rebecca, Liverpool April 2020'
                 },
                 component: 'textComponent'
              }
           ]
        }
     ])
    })
  })
  describe('user settings', () => {
    it.skip('defines layout according to a user custom pattern', () => {
    })
    it.skip('defines and uses custom converter functions for user convenience', () => {
    })
  })
})
