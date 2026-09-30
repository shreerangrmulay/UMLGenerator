/**
 * Sample UML Class Diagrams for demonstration and quick testing.
 */

export const SAMPLES = {
  ecommerce: {
    id: 'sample-ecommerce',
    name: 'E-Commerce System',
    classes: [
      {
        id: 'cls-user',
        name: 'User',
        position: { x: 80, y: 80 },
        attributes: [
          { id: 'u-1', name: 'id', type: 'int', visibility: 'private', static: false, final: false },
          { id: 'u-2', name: 'name', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'u-3', name: 'email', type: 'String', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'um-1',
            name: 'login',
            returnType: 'boolean',
            visibility: 'public',
            parameters: [{ name: 'password', type: 'String' }],
            static: false,
            abstract: false
          },
          {
            id: 'um-2',
            name: 'logout',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-order',
        name: 'Order',
        position: { x: 440, y: 80 },
        attributes: [
          { id: 'o-1', name: 'orderId', type: 'int', visibility: 'private', static: false, final: false },
          { id: 'o-2', name: 'orderDate', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'o-3', name: 'totalAmount', type: 'double', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'om-1',
            name: 'calculateTotal',
            returnType: 'double',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          },
          {
            id: 'om-2',
            name: 'confirmOrder',
            returnType: 'boolean',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-product',
        name: 'Product',
        position: { x: 800, y: 80 },
        attributes: [
          { id: 'p-1', name: 'id', type: 'int', visibility: 'private', static: false, final: false },
          { id: 'p-2', name: 'name', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'p-3', name: 'price', type: 'double', visibility: 'private', static: false, final: false },
          { id: 'p-4', name: 'stock', type: 'int', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'pm-1',
            name: 'isAvailable',
            returnType: 'boolean',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-payment',
        name: 'PaymentService',
        position: { x: 440, y: 400 },
        attributes: [
          { id: 'pay-1', name: 'gatewayUrl', type: 'String', visibility: 'private', static: true, final: true },
          { id: 'pay-2', name: 'apiKey', type: 'String', visibility: 'private', static: false, final: true }
        ],
        methods: [
          {
            id: 'paym-1',
            name: 'processPayment',
            returnType: 'boolean',
            visibility: 'public',
            parameters: [
              { name: 'amount', type: 'double' },
              { name: 'account', type: 'String' }
            ],
            static: false,
            abstract: false
          }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel-1',
        source: 'cls-user',
        target: 'cls-order',
        type: 'association',
        label: 'places',
        sourceMultiplicity: '1',
        targetMultiplicity: '*'
      },
      {
        id: 'rel-2',
        source: 'cls-order',
        target: 'cls-product',
        type: 'association',
        label: 'contains',
        sourceMultiplicity: '*',
        targetMultiplicity: '*'
      },
      {
        id: 'rel-3',
        source: 'cls-order',
        target: 'cls-payment',
        type: 'dependency',
        label: 'processesWith',
        sourceMultiplicity: '',
        targetMultiplicity: ''
      }
    ]
  },

  inheritance: {
    id: 'sample-inheritance',
    name: 'Animal Inheritance Hierarchy',
    classes: [
      {
        id: 'cls-animal',
        name: 'Animal',
        position: { x: 380, y: 60 },
        attributes: [
          { id: 'a-1', name: 'name', type: 'String', visibility: 'protected', static: false, final: false },
          { id: 'a-2', name: 'age', type: 'int', visibility: 'protected', static: false, final: false }
        ],
        methods: [
          {
            id: 'am-1',
            name: 'makeSound',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: true
          },
          {
            id: 'am-2',
            name: 'sleep',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-dog',
        name: 'Dog',
        position: { x: 180, y: 340 },
        attributes: [
          { id: 'd-1', name: 'breed', type: 'String', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'dm-1',
            name: 'makeSound',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          },
          {
            id: 'dm-2',
            name: 'fetchBall',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-cat',
        name: 'Cat',
        position: { x: 580, y: 340 },
        attributes: [
          { id: 'c-1', name: 'isLazy', type: 'boolean', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'cm-1',
            name: 'makeSound',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          },
          {
            id: 'cm-2',
            name: 'purr',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel-dog-animal',
        source: 'cls-dog',
        target: 'cls-animal',
        type: 'inheritance',
        label: 'extends',
        sourceMultiplicity: '',
        targetMultiplicity: ''
      },
      {
        id: 'rel-cat-animal',
        source: 'cls-cat',
        target: 'cls-animal',
        type: 'inheritance',
        label: 'extends',
        sourceMultiplicity: '',
        targetMultiplicity: ''
      }
    ]
  },

  university: {
    id: 'sample-university',
    name: 'University Management',
    classes: [
      {
        id: 'cls-student',
        name: 'Student',
        position: { x: 80, y: 100 },
        attributes: [
          { id: 's-1', name: 'id', type: 'int', visibility: 'private', static: false, final: false },
          { id: 's-2', name: 'name', type: 'String', visibility: 'private', static: false, final: false },
          { id: 's-3', name: 'gpa', type: 'double', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'sm-1',
            name: 'study',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-course',
        name: 'Course',
        position: { x: 440, y: 100 },
        attributes: [
          { id: 'cr-1', name: 'courseCode', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'cr-2', name: 'title', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'cr-3', name: 'credits', type: 'int', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'crm-1',
            name: 'getSyllabus',
            returnType: 'String',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      },
      {
        id: 'cls-instructor',
        name: 'Instructor',
        position: { x: 800, y: 100 },
        attributes: [
          { id: 'ins-1', name: 'employeeId', type: 'int', visibility: 'private', static: false, final: false },
          { id: 'ins-2', name: 'name', type: 'String', visibility: 'private', static: false, final: false },
          { id: 'ins-3', name: 'department', type: 'String', visibility: 'private', static: false, final: false }
        ],
        methods: [
          {
            id: 'insm-1',
            name: 'teachCourse',
            returnType: 'void',
            visibility: 'public',
            parameters: [],
            static: false,
            abstract: false
          }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel-univ-1',
        source: 'cls-student',
        target: 'cls-course',
        type: 'association',
        label: 'enrolls',
        sourceMultiplicity: '1..*',
        targetMultiplicity: '*'
      },
      {
        id: 'rel-univ-2',
        source: 'cls-instructor',
        target: 'cls-course',
        type: 'association',
        label: 'teaches',
        sourceMultiplicity: '1',
        targetMultiplicity: '1..*'
      }
    ]
  },

  empty: {
    id: 'sample-empty',
    name: 'Empty Diagram',
    classes: [],
    relationships: []
  }
};
