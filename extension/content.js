const SERVER_URL = 'http://localhost:3000';

console.log('lazyClicker loaded (Secure Mode)');

// Monitor for new questions
const observer = new MutationObserver(async (mutations) => {
  const questionElement = document.querySelector('[data-test="question-text"], .question-text, [class*="question"]');
  
  if (questionElement && !questionElement.dataset.processed) {
    questionElement.dataset.processed = 'true';
    
    const questionText = questionElement.textContent.trim();
    console.log('Question detected:', questionText);
    
    // Get answer options
    const options = [];
    const optionElements = document.querySelectorAll('[data-test*="answer"], [class*="answer-option"], button[class*="option"]');
    
    optionElements.forEach((el, index) => {
      options.push({
        index: index,
        text: el.textContent.trim(),
        element: el
      });
    });
    
    console.log('Options found:', options);
    
    // Send notification
    chrome.runtime.sendMessage({
      type: 'QUESTION_DETECTED',
      question: questionText,
      options: options.map(o => o.text)
    });
    
    // Check if auto-answer is enabled
    const settings = await chrome.storage.sync.get(['autoAnswer', 'provider']);
    
    if (settings.autoAnswer) {
      try {
        // Get AI answer from local server
        const answer = await getAIAnswer(
          questionText, 
          options.map(o => o.text),
          settings.provider || 'openai'
        );
        
        console.log('AI Answer:', answer);
        
        // Find and click the matching option
        const matchedOption = options.find(opt => 
          opt.text.toLowerCase().includes(answer.toLowerCase()) ||
          answer.toLowerCase().includes(opt.text.toLowerCase())
        );
        
        if (matchedOption) {
          console.log('Clicking option:', matchedOption.text);
          setTimeout(() => {
            matchedOption.element.click();
          }, 1000);
        }
      } catch (error) {
        console.error('Error getting AI answer:', error);
        chrome.runtime.sendMessage({
          type: 'ERROR',
          message: 'Could not connect to local server. Is it running?'
        });
      }
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Function to get answer from local server (API key never exposed!)
async function getAIAnswer(question, options, provider) {
  const response = await fetch(`${SERVER_URL}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question: question,
      options: options,
      provider: provider
    })
  });
  
  if (!response.ok) {
    throw new Error('Server request failed');
  }
  
  const data = await response.json();
  return data.answer;
}