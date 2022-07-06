var el = wp.element.createElement;
wp.blocks.registerBlockType('yannyann/professor', {
  title: 'Professor Box',
  icon: 'businessperson',
  category: 'common',
  attributes: {
    urltext1: { type: 'string' },
    urltext2: { type: 'string' },
    url1: { type: 'string' },
    url2: { type: 'string' },
    phone: { type: 'string' },
    email1: { type: 'string' },
    emailtext1: { type: 'string' },
    email2: { type: 'string' },
    emailtext2: { type: 'string' },
    address: { type: 'string' },
  },
  
  /* This configures how the content and color fields will work, and sets up the necessary elements */
  edit: function(props) {
    // How our block renders in the editor in edit mode

    function updateurltext1( event ) {
      props.setAttributes( { urltext1: event.target.value } );
    }

    function updateurltext2( event ) {
      props.setAttributes( { urltext2: event.target.value } );
    }

    function updateUrl1( event ) {
      props.setAttributes( { url1: event.target.value } );
    }

    function updateUrl2( event ) {
      props.setAttributes( { url2: event.target.value } );
    }

    function updatephone( event ) {
      props.setAttributes( { phone: event.target.value } );
    }

    function updateemail1( event ) {
      props.setAttributes( { email1: event.target.value } );
    }

    function updateemailtext1( event ) {
      props.setAttributes( { emailtext1: event.target.value } );
    }

    function updateemail2( event ) {
      props.setAttributes( { email2: event.target.value } );
    }

    function updateemailtext2( event ) {
      props.setAttributes( { emailtext2: event.target.value } );
    }

    function updateaddress( event ) {
      props.setAttributes( { address: event.target.value } );
    }

    return el( 'section',
      {
          className: 'yann_professor',
      },
      el( 'div', { className: 'social-box clr' },
        el( 'ul', { className: 'clr' },
          el( 'li', null, 
            el( 'span', null, '😊 PROFESSOR: '),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter urltext1 here...',
                value: props.attributes.urltext1,
                onChange: updateurltext1,
                style: { width: '100%' }
              }
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter url1 here...',
                value: props.attributes.url1,
                onChange: updateUrl1,
                style: { width: '100%' }
              }
            ),
            el('span', null, " "),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter urltext2 here...',
                value: props.attributes.urltext2,
                onChange: updateurltext2,
                style: { width: '100%' }
              }
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter url2 here...',
                value: props.attributes.url2,
                onChange: updateUrl2,
                style: { width: '100%' }
              }
            ),
          ),
          el( 'li', null,
            el( 'span',
              {
                className: 'fa fa-phone',
                'aria-hidden': 'true',
              }, " TEL: "
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter phone here...',
                value: props.attributes.phone,
                onChange: updatephone,
                style: { width: '100%' }
              }
            ),
          ),
          el( 'li', null,
            el( 'span',
              {
                className: 'fa fa-envelope',
                'aria-hidden': 'true',
              }, " EMAIL: "
            ),

            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter email1 here...',
                value: props.attributes.email1,
                onChange: updateemail1,
                style: { width: '100%' }
              }
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter emailtext1 here...',
                value: props.attributes.emailtext1,
                onChange: updateemailtext1,
                style: { width: '100%' }
              }
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter email2 here...',
                value: props.attributes.email2,
                onChange: updateemail2,
                style: { width: '100%' }
              }
            ),
            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter emailtext2 here...',
                value: props.attributes.emailtext2,
                onChange: updateemailtext2,
                style: { width: '100%' }
              }
            ),

          ),
          el( 'li', null,
            el( 'span',
              {
                className: 'fa fa-address-book',
                'aria-hidden': 'true',
              }, " ADDR: "
            ),

            el(
              'input',
              {
                type: 'text',
                placeholder: 'Enter address here...',
                value: props.attributes.address,
                onChange: updateaddress,
                style: { width: '100%' }
              }
            ),

          ),
        ),
      ),
    ); // End return
  },  // End edit()

  save: function(props) {
    // How our block renders on the frontend
 
    return el( 'section',
        {
            className: 'yann_professor',
        },
        el( 'div', { className: 'social-box clr' },
          el( 'ul', { className: 'clr' },
            el( 'li', null, 
              el( 'span',null, '😊 PROFESSOR: '),
              el( 'a',
                {
                  "href": props.attributes.url1,
                  "target": "_blank",
                  "rel": "noopener noreferrer",
                },
                " " + props.attributes.urltext1
              ),
              el( 'span',null, ' '),
              el( 'a',
                {
                  "href": props.attributes.url2,
                  "target": "_blank",
                  "rel": "noopener noreferrer",
                },
                props.attributes.urltext2
              ),
            ),
            el( 'li', null,
              el( 'span',
                {
                  className: 'fa fa-phone',
                  'aria-hidden': 'true',
                }, " TEL: "
              ),
              " " + props.attributes.phone
            ),
            el( 'li', null,
              el( 'span',
                {
                  className: 'fa fa-envelope',
                  'aria-hidden': 'true',
                }, " EMAIL: "
              ),
              el( 'a',
                {
                  "href": "mailto:"+props.attributes.email1,
                  "target": "_self",
                  "rel": "noopener noreferrer",
                },
                " " + props.attributes.emailtext1
              ),
              el( 'span',null, ', '),
              el( 'a',
                {
                  "href": "mailto:"+props.attributes.email2,
                  "target": "_self",
                  "rel": "noopener noreferrer",
                },
                props.attributes.emailtext2
              ),
            ),
            el( 'li', null,
              el( 'span',
                {
                  className: 'fa fa-address-book',
                  'aria-hidden': 'true',
                }, " ADDR: "
              ),
              " " + props.attributes.address,
            ),
          ),
        ),
    ); // End return
  } // End save()
})
