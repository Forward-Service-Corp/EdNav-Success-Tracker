const wisconsinCounties = [
  'Adams', 'Ashland', 'Barron', 'Bayfield', 'Brown', 'Buffalo', 'Burnett', 'Calumet',
  'Chippewa', 'Clark', 'Columbia', 'Crawford', 'Dane', 'Dodge', 'Door', 'Douglas',
  'Dunn', 'Eau Claire', 'Florence', 'Fond du Lac', 'Forest', 'Grant', 'Green', 'Green Lake',
  'Iowa', 'Iron', 'Jackson', 'Jefferson', 'Juneau', 'Kenosha', 'Kewaunee', 'La Crosse',
  'Lafayette', 'Langlade', 'Lincoln', 'Manitowoc', 'Marathon', 'Marinette', 'Marquette',
  'Menominee', 'Milwaukee', 'Monroe', 'Oconto', 'Oneida', 'Outagamie', 'Ozaukee', 'Pepin',
  'Pierce', 'Polk', 'Portage', 'Price', 'Racine', 'Richland', 'Rock', 'Rusk', 'Sauk',
  'Sawyer', 'Shawano', 'Sheboygan', 'St. Croix', 'Taylor', 'Trempealeau', 'Vernon',
  'Vilas', 'Walworth', 'Washburn', 'Washington', 'Waukesha', 'Waupaca', 'Waushara',
  'Winnebago', 'Wood'
];

export const clientFormFields = [
  {
    'name': 'first_name',
    'label': 'First Name',
    'type': 'text',
    'required': true,
    'value': 'formData.first_name',
    'options': null
  },
  {
    'name': 'last_name',
    'label': 'Last Name',
    'type': 'text',
    'required': true,
    'value': 'formData.last_name',
    'options': null
  },
  {
    'name': 'email',
    'label': 'Email',
    'type': 'text',
    'required': true,
    'value': 'formData.email',
    'options': null
  },
  {
    'name': 'contactNumber',
    'label': 'Contact Number',
    'type': 'text',
    'required': true,
    'value': 'formData.contactNumber',
    'options': null
  },
  {
    'name': 'caseNumber',
    'label': 'Case Number',
    'type': 'text',
    'required': true,
    'value': 'formData.caseNumber',
    'options': null
  },
  {
    'name': 'pin',
    'label': 'PIN',
    'type': 'text',
    'required': true,
    'value': 'formData.pin',
    'options': null
  },
  {
    'name': 'dob',
    'label': 'Date of Birth',
    'type': 'date',
    'required': true,
    'value': 'formData.dob',
    'options': null
  },
  {
    'name': 'fep',
    'label': 'FEP',
    'type': 'select',
    'required': true,
    'options': [],
    'value': 'formData.fep'
  },
  {
    'name': 'navigator',
    'label': 'Navigator',
    'type': 'select',
    'required': true,
    'options': [
      'Adult',
      'Youth'
    ]
  },
  {
    'name': 'dateReferred',
    'label': 'Date Referred',
    'type': 'date',
    'required': true,
    'value': 'formData.dateReferred',
    'options': null
  },
  {
    'name': 'lastGrade',
    'label': 'Last Grade Completed',
    'type': 'select',
    'required': true,
    'options': 'lastGradeCompletedOptions',
    'value': 'formData.lastGrade'
  },
  {
    'name': 'region',
    'label': 'Region',
    'type': 'select',
    'required': true,
    'options': [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ],
    'value': 'formData.region'
  },
  {
    'name': 'group',
    'label': 'Age Group',
    'type': 'select',
    'required': true,
    'options': [
      'Adult',
      'Youth'
    ],
    'value': 'formData.group'
  },
  {
    'name': 'schoolIfEnrolled',
    'label': 'School (if enrolled)',
    'type': 'select',
    'required': true,
    'options': [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ]
  },
  {
    'name': 'county',
    'label': 'county',
    'type': 'select',
    'required': true,
    'options': wisconsinCounties,
    'value': 'formData.officeCity'
  },
  {
    'name': 'ttsDream',
    'label': 'TTS Dream',
    'type': 'textarea',
    'required': true,
    'value': 'formData.ttsDream',
    'options': null
  }
];


