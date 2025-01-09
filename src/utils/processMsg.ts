const processMessageText = (text: string): string => {
    // Replace double asterisks with strong tags for bold text
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Split into lines to handle bullet points
    const lines = processedText.split('\\n');
    processedText = lines.map(line => {
      // If line starts with "- ", convert it to a bullet point
      if (line.trim().startsWith('- ')) {
        return `<li>${line.trim().substring(2)}</li>`;
      }
      return line;
    }).join('\n');
    
    // Wrap consecutive <li> elements with <ul>
    processedText = processedText.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');
    
    return processedText;
  };
  
  export default processMessageText