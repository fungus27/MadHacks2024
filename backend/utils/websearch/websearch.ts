import duckDuckGoSearch from 'duckduckgo-search';

const websearch = async (query: string) => {
    const results: any[] = []; // Specify the type of the results array as an array of any type
    for await (const result of duckDuckGoSearch.text(query)) {
        results.push(result);
      }
    // Only top 10 results
    const top10 = results.slice(0, 10);
  
    // Get only title and body from the results
    const final: string[] = [];
    for (const result of top10) {
      final.push('TITLE: ' + result.title + ' BODY: ' + result.body + ' -NEXT RESULT- ');
    }
    return final.join('');
};

export default websearch;
