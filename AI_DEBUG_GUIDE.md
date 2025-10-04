# AI Debug Guide - How to Check AI vs Hardcoded Values

## 🎯 Quick Visual Indicators

### 1. **Source Badges in UI**
- **🤖 AI Generated** (Green badge) = Content from DeepSeek AI via Puter.js
- **📋 Hardcoded** (Orange badge) = Content from fallback generator

### 2. **AI Debug Panel** (Top-left corner, click to hide/show)
Shows real-time status of all generated content:
- Patient Data Status
- Diet Plan Source (AI vs Hardcoded)
- Medication Counselling Source
- Environment Check (Puter.js availability)

## 🔍 Console Logging

Open browser console (F12) to see detailed logs:

### AI Success Logs:
```
🤖 Calling DeepSeek AI via Puter.js... {model: "deepseek-chat", temperature: 0.2}
📝 Sending prompt to Puter.js: {promptLength: 1234}
✅ Puter.js DeepSeek response received: {contentLength: 1234, hasJson: true, timestamp: "2025-01-03T10:00:00.000Z"}
🎯 AI Generated content successfully parsed
```

### Fallback Logs:
```
⚠️ DeepSeek diet plan failed, using fallback. Reason: Puter.js not available
📋 Using hardcoded fallback generator
```

### Puter.js Issues:
```
🔑 Puter.js not available. Make sure the script is loaded.
❌ Puter.js DeepSeek call failed: [error details]
```

## 🛠️ How to Test

### Test 1: With Puter.js (Should show AI)
1. Make sure Puter.js script is loaded in `public/index.html`
2. Start the app: `npm start`
3. Generate diet plan
4. Look for: **🤖 AI Generated** badge
5. Check console for: `🤖 Calling DeepSeek AI via Puter.js...`

### Test 2: Without Puter.js (Should show Hardcoded)
1. Remove or comment out the Puter.js script from `public/index.html`
2. Restart the app: `npm start`
3. Generate diet plan
4. Look for: **📋 Hardcoded** badge
5. Check console for: `⚠️ DeepSeek diet plan failed, using fallback`

## 📊 Data Structure Indicators

### AI Generated Content:
```javascript
{
  patientName: "Mr. Rajesh Sharma",
  diagnosis: "Advanced Carcinoma Pancreas...",
  plan: { /* AI generated plan */ },
  _aiGenerated: true,           // ← AI indicator
  _generatedAt: "2025-01-03T10:00:00.000Z",
  _source: "DeepSeek AI"        // ← AI source (via Puter.js)
}
```

### Hardcoded Fallback:
```javascript
{
  patientName: "Mr. Rajesh Sharma",
  diagnosis: "Advanced Carcinoma Pancreas...",
  plan: { /* hardcoded plan */ },
  _aiGenerated: false,          // ← Fallback indicator
  _generatedAt: "2025-01-03T10:00:00.000Z",
  _source: "Hardcoded Fallback" // ← Fallback source
}
```

## 🔧 Debugging Steps

### Step 1: Check Environment
- Look at AI Debug Panel → "Environment Check"
- Should show: **✅ Available** (green) for Puter.js or **❌ Not Available** (red)

### Step 2: Check Console Logs
- Open F12 → Console tab
- Look for Puter.js AI call logs when generating content
- Check for error messages

### Step 3: Check UI Badges
- Look for source badges in diet plan header
- Green = AI, Orange = Hardcoded

### Step 4: Check Store Debugger
- Click "Debug Store" button (top-right)
- Look at the raw data structure
- Check for `_aiGenerated` and `_source` fields

## 🚨 Common Issues

### Issue 1: Puter.js Not Loading
**Symptoms:** Always shows hardcoded, console shows Puter.js not available
**Solution:** 
- Check `public/index.html` has Puter.js script tag
- Restart the app after adding script
- Check browser console for script loading errors

### Issue 2: AI Calls Failing
**Symptoms:** Console shows Puter.js call logs but then fallback
**Solution:**
- Check internet connection
- Verify Puter.js is loaded correctly
- Check browser console for Puter.js errors

### Issue 3: Mixed Results
**Symptoms:** Some features show AI, others show hardcoded
**Solution:**
- Check which specific service is failing
- Look at individual service logs in console
- Each service (diet, medication, appointments) has separate AI integration

## 📝 Testing Checklist

- [ ] Puter.js script loaded in `public/index.html`
- [ ] App restarted after adding script
- [ ] Console shows Puter.js AI call logs
- [ ] UI shows "🤖 AI Generated" badges
- [ ] No error messages in console
- [ ] AI Debug Panel shows green indicators

## 🎯 Expected Behavior

### With Puter.js Available:
- Console: `🤖 Calling DeepSeek AI via Puter.js...`
- UI: Green "🤖 AI Generated" badges
- Debug Panel: Green checkmarks
- Content: Personalized AI-generated recommendations

### Without Puter.js:
- Console: `⚠️ DeepSeek diet plan failed, using fallback`
- UI: Orange "📋 Hardcoded" badges  
- Debug Panel: Orange warning icons
- Content: Standard hardcoded recommendations

This guide helps you easily identify whether your app is using AI-generated content or falling back to hardcoded values!
