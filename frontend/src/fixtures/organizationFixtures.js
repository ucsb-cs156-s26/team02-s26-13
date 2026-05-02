const organizationFixtures = {
  oneOrganization: [
    {
      orgCode: "SBHACKS",
      orgTranslationShort: "SB Hacks",
      orgTranslation: "Student-run Hackathon at UCSB",
      inactive: false,
    },
  ],

  threeOrganizations: [
    {
      orgCode: "ACM",
      orgTranslationShort: "ACM",
      orgTranslation: "Association for Computing Machinery",
      inactive: false,
    },

    {
      orgCode: "DSC",
      orgTranslationShort: "Data Science Club",
      orgTranslation: "Data Science Club at UCSB",
      inactive: false,
    },

    {
      orgCode: "SAC",
      orgTranslationShort: "Sports Analytics Club",
      orgTranslation: "UCSB Sports Analytics Club",
      inactive: true,
    },
  ],
};

export { organizationFixtures };
