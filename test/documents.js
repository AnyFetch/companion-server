"use strict";

describe("Documents endpoint", function() {
  describe("GET /documents", function() {
    it("should refuse access if token is missing");
    it("should refuse access if query is missing");
    it("should accept queries and return results");
    it("should sort documents in a chronological order in time sections");
    it("should pre-project snippets and title");
  });

  describe("GET /documents/:id", function() {
    it("should refuse access if token is missing");
    it("should refuse access if the document doesn't exist");
    it("should refuse access without the right permissions");
    it("should accept access with the right permissions");
    it("should accept access if the document has been shared");
    it("should pre-project full and title");
  });
});
