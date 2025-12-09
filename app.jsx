const { useState, useEffect, useRef } = React;
const { MessageCircle, Heart, Mic, Send, ChevronRight, Star, Trophy, Volume2, Clock, Shield, Home, Briefcase, CreditCard, X, Check, Sparkles, User, Bot } = lucide;

// Sebas Language Learning App - Medical Scenario MVP
const SebasApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationsToday, setConversationsToday] = useState(12);
  const [userProgress, setUserProgress] = useState({ level: 3, xp: 340, streak: 7 });
  const [showFeedback, setShowFeedback] = useState(null);
  const messagesEndRef = useRef(null);

  const maxFreeConversations = 15;

  // Scenario data
  const scenarios = [
    {
      id: 'medical',
      title: 'Doctor Visit',
      titleEs: 'Visita al Doctor',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      description: 'Practice describing symptoms and understanding medical instructions',
      descriptionEs: 'Practica describir síntomas y entender instrucciones médicas',
      difficulty: 'Beginner',
      situations: [
        { id: 'symptoms', name: 'Describing Symptoms', nameEs: 'Describir Síntomas' },
        { id: 'insurance', name: 'Insurance Questions', nameEs: 'Preguntas de Seguro' },
        { id: 'prescription', name: 'Understanding Prescriptions', nameEs: 'Entender Recetas' },
      ],
      locked: false,
    },
    {
      id: 'housing',
      title: 'Housing',
      titleEs: 'Vivienda',
      icon: Home,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      description: 'Navigate landlord conversations and lease agreements',
      descriptionEs: 'Navega conversaciones con el landlord y contratos',
      difficulty: 'Intermediate',
      situations: [
        { id: 'maintenance', name: 'Maintenance Request', nameEs: 'Solicitar Reparaciones' },
        { id: 'lease', name: 'Lease Questions', nameEs: 'Preguntas del Contrato' },
      ],
      locked: false,
    },
    {
      id: 'work',
      title: 'Job Interview',
      titleEs: 'Entrevista de Trabajo',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      description: 'Prepare for interviews and workplace conversations',
      descriptionEs: 'Prepárate para entrevistas y conversaciones de trabajo',
      difficulty: 'Intermediate',
      locked: true,
    },
    {
      id: 'banking',
      title: 'Banking',
      titleEs: 'Banco',
      icon: CreditCard,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      description: 'Open accounts, discuss loans, handle disputes',
      descriptionEs: 'Abrir cuentas, discutir préstamos, resolver problemas',
      difficulty: 'Advanced',
      locked: true,
    },
  ];

  // Medical scenario conversation flow
  const medicalConversation = {
    initial: {
      speaker: 'doctor',
      message: "Good morning! I'm Dr. Martinez. What brings you in today?",
      messageEs: "¡Buenos días! Soy la Dra. Martinez. ¿Qué te trae hoy?",
      hints: [
        "I've been having headaches...",
        "My stomach has been hurting...",
        "I haven't been sleeping well..."
      ],
      vocabulary: ['symptoms', 'pain', 'discomfort'],
    },
    responses: {
      headache: {
        speaker: 'doctor',
        message: "I see. How long have you been experiencing these headaches? Would you say the pain is sharp, dull, or throbbing?",
        messageEs: "Entiendo. ¿Cuánto tiempo has tenido estos dolores de cabeza? ¿Dirías que el dolor es agudo, sordo, o pulsante?",
        vocabulary: ['sharp', 'dull', 'throbbing', 'duration'],
        tip: "💡 Tip: In English, we describe pain intensity as 'mild', 'moderate', or 'severe'",
      },
      stomach: {
        speaker: 'doctor',
        message: "I understand. Is the pain constant, or does it come and go? Have you noticed any other symptoms like nausea?",
        messageEs: "Entiendo. ¿El dolor es constante o va y viene? ¿Has notado otros síntomas como náuseas?",
        vocabulary: ['constant', 'intermittent', 'nausea', 'symptoms'],
        tip: "💡 Tip: 'Come and go' means something that isn't constant - 'intermittent' in medical terms",
      },
      sleep: {
        speaker: 'doctor',
        message: "That's important to address. How many hours of sleep are you getting? Do you have trouble falling asleep or staying asleep?",
        messageEs: "Es importante atender eso. ¿Cuántas horas duermes? ¿Tienes problemas para dormirte o para mantenerte dormido?",
        vocabulary: ['insomnia', 'falling asleep', 'staying asleep'],
        tip: "💡 Tip: English speakers often say 'having trouble' + verb-ing for difficulties",
      },
    },
  };

  // Housing scenario conversation flow
  const housingConversation = {
    initial: {
      speaker: 'landlord',
      message: "Hello, this is Tom from Westside Property Management. How can I help you today?",
      messageEs: "Hola, habla Tom de Westside Property Management. ¿En qué puedo ayudarte hoy?",
      hints: [
        "I need to report a problem with my apartment...",
        "I have a question about my lease...",
        "The heating isn't working properly..."
      ],
      vocabulary: ['maintenance', 'lease', 'repair'],
    },
    responses: {
      problem: {
        speaker: 'landlord',
        message: "I'm sorry to hear that. Can you describe the issue? Is it urgent, or can it wait until our next available appointment?",
        messageEs: "Lamento escuchar eso. ¿Puedes describir el problema? ¿Es urgente o puede esperar hasta nuestra próxima cita disponible?",
        vocabulary: ['urgent', 'appointment', 'describe', 'issue'],
        tip: "💡 Tip: Use words like 'urgent' or 'emergency' if the problem affects safety or habitability",
      },
      lease: {
        speaker: 'landlord',
        message: "Sure, I can help with that. What section of the lease are you asking about? Is it regarding the security deposit, rent, or something else?",
        messageEs: "Claro, puedo ayudar con eso. ¿Sobre qué sección del contrato preguntas? ¿Es sobre el depósito de seguridad, la renta, u otra cosa?",
        vocabulary: ['security deposit', 'rent', 'terms', 'clause'],
        tip: "💡 Tip: 'Lease' and 'rental agreement' mean the same thing in housing contexts",
      },
      heating: {
        speaker: 'landlord',
        message: "That's definitely something we need to address quickly. When did you first notice the issue? Is the heating not turning on at all, or is it just not getting warm enough?",
        messageEs: "Eso definitivamente necesitamos atenderlo rápido. ¿Cuándo notaste el problema por primera vez? ¿La calefacción no enciende o simplemente no calienta suficiente?",
        vocabulary: ['heating', 'thermostat', 'temperature', 'HVAC'],
        tip: "💡 Tip: Heating issues are often considered urgent repairs - landlords must fix them quickly",
      },
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start a scenario
  const startScenario = (scenario) => {
    if (scenario.locked) return;
    if (conversationsToday >= maxFreeConversations) {
      setCurrentView('upgrade');
      return;
    }
    setSelectedScenario(scenario);
    
    const conversation = scenario.id === 'housing' ? housingConversation : medicalConversation;
    const character = scenario.id === 'housing' ? 'Tom • Property Manager' : 'Dr. Martinez • Medical Office';
    
    setMessages([
      {
        id: 1,
        type: 'system',
        content: `🎭 Scenario: ${scenario.title}`,
        contentEs: `🎭 Escenario: ${scenario.titleEs}`,
      },
      {
        id: 2,
        type: 'tip',
        content: "Remember: English is spoken slower than Spanish. Take your time with responses.",
        contentEs: "Recuerda: El inglés se habla más lento que el español. Tómate tu tiempo.",
      },
      {
        id: 3,
        type: 'bot',
        content: conversation.initial.message,
        contentEs: conversation.initial.messageEs,
        hints: conversation.initial.hints,
        vocabulary: conversation.initial.vocabulary,
      },
    ]);
    setCurrentView('chat');
  };

  // Handle sending a message
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Get the right conversation based on scenario
    const conversation = selectedScenario?.id === 'housing' ? housingConversation : medicalConversation;

    // Simulate AI response with feedback
    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let response;

      if (selectedScenario?.id === 'housing') {
        // Housing responses
        if (lowerInput.includes('problem') || lowerInput.includes('report') || lowerInput.includes('issue')) {
          response = conversation.responses.problem;
        } else if (lowerInput.includes('lease') || lowerInput.includes('contract') || lowerInput.includes('agreement')) {
          response = conversation.responses.lease;
        } else if (lowerInput.includes('heat') || lowerInput.includes('cold') || lowerInput.includes('temperature')) {
          response = conversation.responses.heating;
        } else {
          response = {
            speaker: 'landlord',
            message: "I want to make sure I understand. Could you give me more details about the situation?",
            messageEs: "Quiero asegurarme de entender. ¿Podrías darme más detalles sobre la situación?",
            tip: "💡 Tip: Try using phrases like 'I need to report...' or 'I have a question about...'",
          };
        }
      } else {
        // Medical responses
        if (lowerInput.includes('headache') || lowerInput.includes('head')) {
          response = conversation.responses.headache;
        } else if (lowerInput.includes('stomach') || lowerInput.includes('hurt')) {
          response = conversation.responses.stomach;
        } else if (lowerInput.includes('sleep') || lowerInput.includes('tired')) {
          response = conversation.responses.sleep;
        } else {
          response = {
            speaker: 'doctor',
            message: "I want to make sure I understand correctly. Could you tell me more about what you're experiencing?",
            messageEs: "Quiero asegurarme de entender bien. ¿Podrías contarme más sobre lo que estás experimentando?",
            tip: "💡 Tip: Try using phrases like 'I've been having...' or 'I feel...'",
          };
        }
      }

      // Add encouragement feedback
      const encouragement = [
        "Great job using complete sentences! 👏",
        "Nice! You're communicating clearly. 🌟",
        "Perfect! Keep going at this pace. ✨",
        "Excellent vocabulary choice! 💪",
        "You're doing great! 🎉",
      ];

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'feedback',
          content: encouragement[Math.floor(Math.random() * encouragement.length)],
          positive: true,
        },
        {
          id: prev.length + 2,
          type: 'bot',
          content: response.message,
          contentEs: response.messageEs,
          vocabulary: response.vocabulary,
          tip: response.tip,
        },
      ]);

      setIsTyping(false);
      setConversationsToday((prev) => prev + 1);
    }, 1500);
  };

  // Home Screen
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Hola! 👋
            </h1>
            <p className="text-slate-400 mt-1">Ready to practice today?</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-2 rounded-full">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm">{userProgress.streak} days</span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-indigo-200 text-sm">Level {userProgress.level}</p>
                <p className="text-white font-bold text-xl">Intermediate</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-sm">Today's practice</p>
                <p className="text-white font-bold text-xl">{conversationsToday}/{maxFreeConversations}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.xp % 500) / 5}%` }}
              />
            </div>
            <p className="text-indigo-200 text-xs mt-2">{userProgress.xp} / 500 XP to next level</p>
          </div>
        </div>

        {/* Conversations remaining */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Free conversations</p>
                <p className="text-slate-400 text-sm">{maxFreeConversations - conversationsToday} remaining today</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('upgrade')}
              className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              Get Unlimited →
            </button>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="px-6 pb-32">
        <h2 className="text-white font-bold text-lg mb-4">Practice Scenarios</h2>
        <div className="space-y-4">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                disabled={scenario.locked}
                className={`w-full text-left rounded-2xl p-5 transition-all duration-300 ${
                  scenario.locked 
                    ? 'bg-slate-800/30 opacity-60' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50 hover:scale-[1.02] active:scale-[0.98]'
                } border border-slate-700`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-lg">{scenario.title}</h3>
                      {scenario.locked && (
                        <span className="bg-slate-600 text-slate-300 text-xs px-2 py-0.5 rounded-full">Premium</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{scenario.titleEs}</p>
                    <p className="text-slate-500 text-sm">{scenario.descriptionEs}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        scenario.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                        scenario.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {scenario.difficulty}
                      </span>
                      {!scenario.locked && (
                        <span className="text-xs text-slate-500">
                          {scenario.situations?.length || 0} situations
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${scenario.locked ? 'text-slate-600' : 'text-slate-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-6 py-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-indigo-400">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Practice</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Chat Screen
  const ChatScreen = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Chat Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedScenario?.color} flex items-center justify-center`}>
              {selectedScenario && React.createElement(selectedScenario.icon, { className: "w-4 h-4 text-white" })}
            </div>
            <div>
              <h2 className="text-white font-semibold">{selectedScenario?.title}</h2>
              <p className="text-slate-400 text-xs">
                {selectedScenario?.id === 'housing' ? 'Tom • Property Manager' : 'Dr. Martinez • Medical Office'}
              </p>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors">
          <Volume2 className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="text-center">
                <span className="bg-slate-800 text-slate-400 text-sm px-4 py-2 rounded-full">
                  {message.content}
                </span>
              </div>
            );
          }

          if (message.type === 'tip') {
            return (
              <div key={message.id} className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mx-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-indigo-300 text-sm">{message.content}</p>
                    <p className="text-indigo-400/70 text-xs mt-1">{message.contentEs}</p>
                  </div>
                </div>
              </div>
            );
          }

          if (message.type === 'feedback') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className={`${message.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} text-sm px-4 py-2 rounded-full`}>
                  {message.content}
                </div>
              </div>
            );
          }

          if (message.type === 'bot') {
            return (
              <div key={message.id} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedScenario?.color || 'from-rose-500 to-pink-600'} flex items-center justify-center flex-shrink-0`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-md p-4 max-w-[85%]">
                    <p className="text-white">{message.content}</p>
                    {message.contentEs && (
                      <p className="text-slate-500 text-sm mt-2 pt-2 border-t border-slate-700">
                        {message.contentEs}
                      </p>
                    )}
                  </div>
                  
                  {/* Vocabulary tags */}
                  {message.vocabulary && (
                    <div className="flex flex-wrap gap-2">
                      {message.vocabulary.map((word, i) => (
                        <span key={i} className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-700">
                          📚 {word}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tip */}
                  {message.tip && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 max-w-[85%]">
                      <p className="text-amber-300 text-sm">{message.tip}</p>
                    </div>
                  )}

                  {/* Hint buttons */}
                  {message.hints && (
                    <div className="space-y-2 max-w-[85%]">
                      <p className="text-slate-500 text-xs">Try saying:</p>
                      {message.hints.map((hint, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText(hint)}
                          className="block w-full text-left bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm px-4 py-3 rounded-xl border border-slate-700 transition-colors"
                        >
                          "{hint}"
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (message.type === 'user') {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="bg-indigo-600 rounded-2xl rounded-tr-md p-4 max-w-[85%]">
                  <p className="text-white">{message.content}</p>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedScenario?.color || 'from-rose-500 to-pink-600'} flex items-center justify-center flex-shrink-0`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-md p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors flex-shrink-0">
            <Mic className="w-5 h-5 text-slate-300" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your response..."
              className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-full px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              inputText.trim() 
                ? 'bg-indigo-600 hover:bg-indigo-500' 
                : 'bg-slate-700 opacity-50'
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  // Upgrade Screen
  const UpgradeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-6 py-8">
      <button 
        onClick={() => setCurrentView('home')}
        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-8"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Unlock Unlimited Practice</h1>
        <p className="text-slate-400">Master English faster with unlimited conversations</p>
      </div>

      {/* Features */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
        <div className="space-y-4">
          {[
            { icon: MessageCircle, text: 'Unlimited daily conversations' },
            { icon: Heart, text: 'All medical scenarios unlocked' },
            { icon: Home, text: 'Housing & tenant rights practice' },
            { icon: Briefcase, text: 'Job interview preparation' },
            { icon: CreditCard, text: 'Banking & financial English' },
            { icon: Volume2, text: 'Pronunciation feedback' },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                {React.createElement(feature.icon, { className: "w-5 h-5 text-indigo-400" })}
              </div>
              <span className="text-white">{feature.text}</span>
              <Check className="w-5 h-5 text-emerald-400 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4 mb-8">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-5 text-left relative overflow-hidden group">
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
            BEST VALUE
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">Annual</p>
              <p className="text-indigo-200 text-sm">$5.83/month, billed yearly</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$69.99</p>
              <p className="text-indigo-200 text-sm line-through">$119.88</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-white/5 border border-white/20 text-white rounded-2xl p-5 text-left hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">Monthly</p>
              <p className="text-slate-400 text-sm">Cancel anytime</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$9.99</p>
              <p className="text-slate-400 text-sm">/month</p>
            </div>
          </div>
        </button>
      </div>

      {/* CTA */}
      <button className="w-full bg-white text-slate-900 font-bold text-lg rounded-full py-4 hover:bg-slate-100 transition-colors">
        Start 7-Day Free Trial
      </button>
      <p className="text-center text-slate-500 text-sm mt-4">
        Cancel anytime. No commitment required.
      </p>
    </div>
  );

  // Render current view
  return (
    <div className="font-sans antialiased">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'chat' && <ChatScreen />}
      {currentView === 'upgrade' && <UpgradeScreen />}
    </div>
  );
};

// Render the app
const container = document.getElementById('app-container');
const root = ReactDOM.createRoot(container);
root.render(<SebasApp />);