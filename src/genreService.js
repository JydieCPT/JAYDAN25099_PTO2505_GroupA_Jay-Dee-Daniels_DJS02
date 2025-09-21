import { genres } from "../data.js";

/**
 * Service to retrieve genre titles from genre IDs.
 *
 * @principle SRP - Single Responsibility Principle: Only responsible for mapping genre IDs to names.
 */
export const GenreService = {
  /**
   * Resolves an array of genre IDs into an array of genre titles.
   * @param {number[]} genreIds - Array of genre IDs.
   * @returns {string[]} Array of genre titles.
   */
  getNames(genreIds) {
    return genreIds.map(
      (id) => genres.find((g) => g.id === id)?.title || "Unknown"
    );
  },
};
