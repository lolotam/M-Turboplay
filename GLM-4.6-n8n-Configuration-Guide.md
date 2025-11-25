# GLM-4.6 AI Model Configuration with n8n

This comprehensive guide will help you configure the GLM-4.6 AI model with n8n for powerful workflow automation.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GLM-4.6 API Overview](#glm-46-api-overview)
3. [Setting up n8n](#setting-up-n8n)
4. [Configuring GLM-4.6 in n8n](#configuring-glm-46-in-n8n)
5. [Authentication](#authentication)
6. [Example Workflows](#example-workflows)
7. [Advanced Configuration](#advanced-configuration)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:
- n8n installed (local or cloud version)
- GLM-4.6 API access and credentials
- Basic understanding of n8n workflows
- Node.js 18+ (for local n8n installation)

## GLM-4.6 API Overview

GLM-4.6 is a powerful language model that provides:
- Text generation and completion
- Multi-turn conversations
- Code generation
- Data analysis capabilities

### API Endpoints
- **Base URL**: `https://open.bigmodel.cn/api/paas/v4/`
- **Chat Completion**: `/chat/completions`
- **Model Name**: `glm-4.6`

### Required Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}
```

## Setting up n8n

### Option 1: Local Installation
```bash
# Install n8n locally
npm install n8n -g

# Start n8n
n8n start
```

### Option 2: Docker Installation
```bash
# Pull and run n8n Docker image
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 3: n8n Cloud
Sign up at [n8n.cloud](https://n8n.cloud) for a hosted solution.

## Configuring GLM-4.6 in n8n

### Step 1: Create HTTP Request Node

1. Drag an **HTTP Request** node to your canvas
2. Configure the node with the following settings:

#### Basic Configuration
- **Method**: `POST`
- **URL**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **Response Format**: `JSON`

#### Headers Tab
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{ $credentials.glm46.apiKey }}"
}
```

#### Body Tab
Select `JSON` and use this template:
```json
{
  "model": "glm-4.6",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.message }}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### Step 2: Create GLM-4.6 Credentials

1. Go to **Credentials** in n8n
2. Click **Add credential**
3. Select **Header Auth** (or create a custom credential)
4. Configure:
   - **Name**: `GLM-4.6 API`
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer YOUR_API_KEY`

## Authentication

### Getting Your GLM-4.6 API Key

1. Visit [Zhipu AI](https://open.bigmodel.cn/)
2. Register or login to your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key for use in n8n

### Setting Up Credentials in n8n

#### Method 1: Using Header Auth
1. Create new credential: **Header Auth**
2. Set name to `glm46`
3. Configure:
   - **Name**: `GLM-4.6 API`
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer YOUR_ACTUAL_API_KEY`

#### Method 2: Using Custom Credential
1. Create new credential: **Custom**
2. Add these parameters:
   ```json
   {
     "apiKey": "YOUR_ACTUAL_API_KEY",
     "baseUrl": "https://open.bigmodel.cn/api/paas/v4/"
   }
   ```

## Example Workflows

### Workflow 1: Simple Text Generation

**Nodes:**
1. **Manual Trigger** → Start the workflow
2. **Set Node** → Define your prompt
3. **HTTP Request** → Call GLM-4.6 API
4. **Code Node** → Process the response

**Set Node Configuration:**
```json
{
  "message": "Explain quantum computing in simple terms"
}
```

**Code Node (Processing Response):**
```javascript
// Extract the generated text from GLM-4.6 response
const response = items[0].json;
const generatedText = response.choices[0].message.content;

return [{
  json: {
    prompt: response.messages[0].content,
    response: generatedText,
    model: response.model,
    usage: response.usage
  }
}];
```

### Workflow 2: Multi-Turn Conversation

**Nodes:**
1. **Webhook** → Receive user messages
2. **Code Node** → Manage conversation history
3. **HTTP Request** → Call GLM-4.6 with context
4. **Code Node** → Update conversation history
5. **HTTP Response** → Return answer

**Conversation Management Code:**
```javascript
// Get or initialize conversation history
let conversationHistory = $getWorkflowStaticData('global').conversationHistory || [];

// Add new user message
const userMessage = {
  role: 'user',
  content: $json.message
};
conversationHistory.push(userMessage);

// Keep only last 10 messages to manage token usage
if (conversationHistory.length > 10) {
  conversationHistory = conversationHistory.slice(-10);
}

// Store updated history
$getWorkflowStaticData('global').conversationHistory = conversationHistory;

return [{
  json: {
    messages: conversationHistory
  }
}];
```

### Workflow 3: Code Generation and Execution

**Nodes:**
1. **Manual Trigger**
2. **Set Node** → Define coding task
3. **HTTP Request** → Generate code with GLM-4.6
4. **Code Node** → Extract and validate code
5. **Execute Command** → Run the code (optional)
6. **Code Node** → Process results

**Prompt Template:**
```json
{
  "message": "Write a Python function that calculates fibonacci numbers. Include error handling and documentation."
}
```

## Advanced Configuration

### Custom Parameters

You can enhance your GLM-4.6 requests with additional parameters:

```json
{
  "model": "glm-4.6",
  "messages": [...],
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 2000,
  "stream": false,
  "stop": ["\n\n", "###"],
  "presence_penalty": 0,
  "frequency_penalty": 0
}
```

### Error Handling

Add error handling to your workflows:

```javascript
// Error handling code node
try {
  const response = items[0].json;
  
  if (response.error) {
    throw new Error(`GLM-4.6 API Error: ${response.error.message}`);
  }
  
  if (!response.choices || response.choices.length === 0) {
    throw new Error('No response generated');
  }
  
  return items;
} catch (error) {
  // Log error and return error response
  console.error('GLM-4.6 Error:', error);
  
  return [{
    json: {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    }
  }];
}
```

### Rate Limiting

Implement rate limiting to avoid API limits:

```javascript
// Rate limiting code node
const lastCallTime = $getWorkflowStaticData('global').lastCallTime || 0;
const now = Date.now();
const minInterval = 2000; // 2 seconds between calls (increased for GLM-4.6)

if (now - lastCallTime < minInterval) {
  const waitTime = minInterval - (now - lastCallTime);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}

$getWorkflowStaticData('global').lastCallTime = Date.now();
```

#### HTTP Request Node Rate Limiting Configuration

In your HTTP Request node, configure these settings under **Options**:

1. **Batch Settings**:
   - **Batch Size**: `1` (process one request at a time)
   - **Batch Interval**: `2000` (2 seconds between batches)

2. **Retry on Fail**:
   - **Enable**: `true`
   - **Max Tries**: `3`
   - **Wait Between Tries**: `5000` (5 seconds)

3. **Timeout**:
   - **Request Timeout**: `30000` (30 seconds)

#### Advanced Rate Limiting with Queue Management

```javascript
// Advanced rate limiting with queue
const queue = $getWorkflowStaticData('global').requestQueue || [];
const now = Date.now();
const maxRequestsPerMinute = 20; // Conservative limit for GLM-4.6
const timeWindow = 60000; // 1 minute

// Clean old requests from queue
const validRequests = queue.filter(timestamp => now - timestamp < timeWindow);
$getWorkflowStaticData('global').requestQueue = validRequests;

// Check if we can make a request
if (validRequests.length >= maxRequestsPerMinute) {
  const oldestRequest = Math.min(...validRequests);
  const waitTime = timeWindow - (now - oldestRequest);
  
  throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime/1000)} seconds.`);
}

// Add current request to queue
validRequests.push(now);
$getWorkflowStaticData('global').requestQueue = validRequests;

return items;
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors
**Problem**: `401 Unauthorized` or invalid API key
**Solution**: 
- Verify your API key is correct
- Check if the key has sufficient credits
- Ensure proper Bearer token format

#### 2. Rate Limiting (429 Error)
**Problem**: `429 Too Many Requests` - "The service is receiving too many requests from you"
**Solution**:
- **Immediate Fix**: Check your API balance and recharge if needed
- **Implement Rate Limiting**: Use the advanced rate limiting code provided above
- **Configure HTTP Request Node**: Set batch size to 1 and interval to 2000ms
- **Monitor Usage**: Track your API usage to avoid hitting limits
- **Upgrade Plan**: Consider upgrading your GLM-4.6 API plan for higher limits

**Specific Error Message Solutions**:
- `"Insufficient balance or no resource package"` → Recharge your account
- `"Try spacing your requests out using the batching settings"` → Configure batch settings in HTTP Request node

#### 3. Token Limits
**Problem**: Response truncated or incomplete
**Solution**:
- Reduce `max_tokens` parameter
- Shorten input prompts
- Implement conversation history management

#### 4. Connection Timeouts
**Problem**: Requests timing out
**Solution**:
- Increase timeout settings in HTTP Request node
- Check network connectivity
- Implement retry logic

### Debugging Tips

1. **Enable Debug Mode**: Add debug nodes to log requests and responses
2. **Test API Independently**: Use curl or Postman to test API endpoints
3. **Monitor Usage**: Track token usage and API costs
4. **Validate JSON**: Ensure request bodies are properly formatted

### Performance Optimization

1. **Batch Requests**: Combine multiple requests when possible
2. **Cache Responses**: Store frequently used responses
3. **Optimize Prompts**: Use efficient prompt engineering
4. **Monitor Latency**: Track response times and optimize accordingly

## Best Practices

1. **Security**: Never expose API keys in workflow code
2. **Error Handling**: Always implement comprehensive error handling
3. **Logging**: Log requests and responses for debugging
4. **Testing**: Test workflows thoroughly before production deployment
5. **Monitoring**: Monitor API usage and costs regularly

## Additional Resources

- [GLM-4.6 Official Documentation](https://open.bigmodel.cn/)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)
- [API Rate Limits and Pricing](https://open.bigmodel.cn/pricing)

## Conclusion

With this guide, you should be able to successfully integrate GLM-4.6 with n8n for powerful AI-powered workflows. Remember to start simple, test thoroughly, and gradually build more complex automations as you become familiar with the platform.

For additional help, consider joining the n8n community or consulting the official documentation for both platforms.

## Emergency Fix for Current 429 Error

If you're currently experiencing the "The service is receiving too many requests from you" error, follow these immediate steps:

### Step 1: Check API Balance
1. Log into your [Zhipu AI Dashboard](https://open.bigmodel.cn/)
2. Check your account balance
3. Recharge if balance is insufficient

### Step 2: Immediate Workflow Changes
1. **Stop all running workflows** that use GLM-4.6
2. **Add this Code Node** before your HTTP Request node:

```javascript
// Emergency rate limiting
const lastCallTime = $getWorkflowStaticData('global').lastCallTime || 0;
const now = Date.now();
const minInterval = 5000; // 5 seconds between calls (very conservative)

if (now - lastCallTime < minInterval) {
  const waitTime = minInterval - (now - lastCallTime);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}

$getWorkflowStaticData('global').lastCallTime = Date.now();
return items;
```

### Step 3: HTTP Request Node Settings
Update your HTTP Request node **Options** tab:
- **Batch Size**: `1`
- **Batch Interval**: `5000` (5 seconds)
- **Retry on Fail**: Enable with 3 retries, 10 seconds between tries

### Step 4: Test with Single Request
1. Create a simple test workflow with just one request
2. Wait 5-10 minutes before testing
3. Monitor if the 429 error persists
