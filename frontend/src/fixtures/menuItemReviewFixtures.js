const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 3,
    itemId: 4,
    reviewerEmail: "joaquinwong@ucsb.edu",
    stars: 5,
    dateReviewed: "2026-12-12T12:12:12",
    comments: "Good",
  },
  threeMenuItemReviews: [
    {
      id: 3,
      itemId: 4,
      reviewerEmail: "joaquinwong@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-12-12T12:12:12",
      comments: "Good",
    },
    {
      id: 4,
      itemId: 1,
      reviewerEmail: "joaquinwong@ucsb.edu",
      stars: 1,
      dateReviewed: "2026-12-12T12:12:12",
      comments: "Bad",
    },
    {
      id: 5,
      itemId: 3,
      reviewerEmail: "johndoe@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-12-12T12:12:12",
      comments: "Okay",
    },
  ],
};

export { menuItemReviewFixtures };
