const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "student1@ucsb.edu",
    professorEmail: "professor1@ucsb.edu",
    explanation: "I need a recommendation for grad school applications.",
    dateRequested: "2024-01-15T00:00:00",
    dateNeeded: "2024-03-01T00:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "I need a recommendation for grad school applications.",
      dateRequested: "2024-01-15T00:00:00",
      dateNeeded: "2024-03-01T00:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "Requesting a letter for a summer internship.",
      dateRequested: "2024-02-01T00:00:00",
      dateNeeded: "2024-04-15T00:00:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      professorEmail: "professor3@ucsb.edu",
      explanation: "Need a recommendation for a fellowship program.",
      dateRequested: "2024-03-10T00:00:00",
      dateNeeded: "2024-05-01T00:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
