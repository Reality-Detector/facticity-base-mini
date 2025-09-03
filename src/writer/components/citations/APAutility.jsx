/*****************************************************
 * Helper: Convert a single author string into APA-like
 *         "LastName, F. M." format if possible.
 *****************************************************/
export function formatSingleAuthor(authorString) {
    if (!authorString || typeof authorString !== 'string') return '';
  
    // Split the name into chunks
    const parts = authorString.trim().split(/\s+/);
  
    // If there's only one part, return it as-is (e.g., "Madonna").
    if (parts.length === 1) {
      return authorString;
    }
  
    // Assume the last part is the last name
    const lastName = parts.pop();
  
    // The remaining parts are first/middle names/initials
    // We'll turn each into an initial: "C" => "C."
    const initials = parts
      .map((p) => (p[0]?.toUpperCase() + '.'))
      .join(' ');
  
    // Return "LastName, F. M."
    return `${lastName}, ${initials}`.trim();
  }
  
  /*****************************************************
   * Helper: Convert a string to a (very) naive sentence case:
   *         - Capitalize the first letter
   *         - Lowercase the rest
   *  (Note: This doesn't preserve proper nouns, but it's
   *   a minimal approach to illustrate the concept.)
   *****************************************************/
  export function toSentenceCase(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  /*****************************************************
   * If no valid *individual* authors are found,
   * we can use an organization or group (if available).
   * Otherwise, we place the title in the author position
   * in sentence case.
   *****************************************************/
  export function getFallbackAuthor(reference) {
    // 1. If there's some group/organization in your data
    //    (e.g., reference.groupAuthor, reference.organization, etc.)
    //    check that first
    if (reference.groupAuthor) {
      return reference.groupAuthor;
    }
  
    if (reference.website) {
      return reference.website;
    }
  
    // 2. If not, place the *title* in the author position (sentence case)
    return toSentenceCase(reference.title);
  }
  
  /*****************************************************
   * Format an array of authors into APA-style, with commas
   * and an ampersand before the last author. Filter out
   * filler text (like "Contributing Writer").
   *****************************************************/
/*****************************************************
 * Format an array of authors into APA 7 reference-list style:
 *
 *  - If 1 author: "Last, F. M."
 *  - If 2 to 20 authors: list them all, and use '&' before the last
 *  - If 21 or more authors: list the first 19, then "...", then the last
 *
 *****************************************************/
export function formatAuthors(authorList = []) {
    if (!authorList.length) {
      // Return an empty string if no authors are available
      return '';
    }
  
    // Filter out filler roles (adjust the regex to suit your needs)
    const filteredAuthors = authorList.filter(
      (a) => !/(writer|navigation|editor)/i.test(a)
    );
  
    // Format each author into "Last, F. M."
    const apaStyledAuthors = filteredAuthors.map(formatSingleAuthor);
  
    // If no valid authors after filtering, return an empty string
    if (!apaStyledAuthors.length) {
      return '';
    }
  
    // 1. If there's only one author, just return it
    if (apaStyledAuthors.length === 1) {
      return apaStyledAuthors[0];
    }
  
    // 2. If 2 to 20 authors
    if (apaStyledAuthors.length <= 20) {
      // Join all but the last with commas, then add "&" before the last
      return (
        apaStyledAuthors.slice(0, -1).join(', ') +
        ', & ' +
        apaStyledAuthors[apaStyledAuthors.length - 1]
      );
    }
  
    // 3. If 21 or more authors:
    //    - List the first 19
    //    - Then use an ellipsis (...)
    //    - Then the final author's name
    const first19 = apaStyledAuthors.slice(0, 19).join(', ');
    const lastAuthor = apaStyledAuthors[apaStyledAuthors.length - 1];
  
    // Note: We do NOT use '&' before the ellipsis in APA 7 references;
    // we simply put ... in place of the intervening authors, then the final name.
    return `${first19}, ... ${lastAuthor}`;
  }
  
  /*****************************************************
   * Main function: Generate an APA-ish reference string
   * for different source types (e.g., "Journal", "Web Source").
   * Uses fallback logic so we don't do "No Author."
   *****************************************************/
  export function generateAPAReference(reference) {
    // 1. Try to format the authors
    let authorsString = formatAuthors(reference.authors);
  
    // 2. If no authors were found, check for org or use title in author position
    if (!authorsString) {
      authorsString = getFallbackAuthor(reference);
    }
  
    // 3. Use year or n.d. if none
    const publicationYear = reference.datePublished || 'n.d.';
  
    // 4. Use source_type to decide the citation format
    const sourceType = (reference.source_type || '').toLowerCase();
    switch (sourceType) {
      case 'journal':
        // Basic pattern for a Journal article:
        // Author, A. A. (Year). Title of the article. Journal Name, volume(issue), pages.
        return `${authorsString} (${publicationYear}). ${reference.title}. ${reference.journalName || 'Journal Name'}, ${reference.volume || ''}${reference.issue ? `(${reference.issue})` : ''}${reference.pages ? `, ${reference.pages}` : ''}.`;
  
      case 'web source':
      default:
        // Basic pattern for a Web Source:
        // Author, A. A. (Year). Title of the page. Website. Retrieved from URL
        return `${authorsString} (${publicationYear}). ${reference.title}. ${reference.website || 'Website'}. Retrieved from ${reference.url || 'URL not provided'}`;
    }
  }

  export function extractLastName(authorString) {
    if (!authorString || typeof authorString !== 'string') {
      return '';
    }
    const parts = authorString.trim().split(/\s+/);
    return parts[parts.length - 1]; // e.g., "Jane M. Doe" -> "Doe"
  }
  


  export function formatInTextCitation(reference) {
    // Grab publication year (or 'n.d.' if missing)
    const year = reference.year || 'n.d.';
  
    // Pull out authors
    let authors = reference.authors || [];
    // Optionally filter out filler roles like "Contributing Writer", etc.
    authors = authors.filter((a) => !/(writer|navigation|editor)/i.test(a));
  
    if (authors.length === 0) {
      // No valid individual authors: fallback to group author/title
      const fallback = getFallbackAuthor(reference);
      return `(${fallback}, ${year})`;
    }
  
    // Extract last names
    const lastNames = authors.map(extractLastName);
  
    if (lastNames.length === 1) {
      // 1 author
      return `(${lastNames[0]}, ${year})`;
    }
  
    if (lastNames.length === 2) {
      // 2 authors
      return `(${lastNames[0]} & ${lastNames[1]}, ${year})`;
    }
  
    // 3+ authors
    return `(${lastNames[0]} et al., ${year})`;
  }