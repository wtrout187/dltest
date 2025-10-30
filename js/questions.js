// Question Management System
class QuestionManager {
  constructor() {
    this.questions = [];
    this.currentQuestion = null;
    this.currentIndex = 0;
    this.sessionQuestions = [];
    this.isLoaded = false;
  }

  async loadQuestions() {
    if (this.isLoaded) return;

    console.log('📚 Loading questions...');

    try {
      // Try to load from data/questions.json
      const response = await fetch('data/questions.json');
      if (response.ok) {
        const data = await response.json();
        this.questions = data.questions || [];
      } else {
        // Fallback to sample questions
        this.questions = this.getSampleQuestions();
      }

      this.isLoaded = true;
      console.log(`✅ Loaded ${this.questions.length} questions`);

    } catch (error) {
      console.warn('Failed to load questions from file, using sample questions:', error);
      this.questions = this.getSampleQuestions();
      this.isLoaded = true;
    }
  }

  getSampleQuestions() {
    return [
      {
        id: 1,
        category: 'traffic-signs',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'What does a red octagonal sign mean?',
        options: [
          'Yield to oncoming traffic',
          'Stop completely',
          'Slow down',
          'No entry'
        ],
        correct: 1,
        explanation: 'A red octagonal sign is a stop sign, which means you must come to a complete stop.',
        reference: 'SD Manual Ch.3, P.15',
        image: null
      },
      {
        id: 2,
        category: 'right-of-way',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'At a four-way stop, who has the right of way?',
        options: [
          'The largest vehicle',
          'The vehicle that arrived first',
          'The vehicle on the right',
          'The vehicle going straight'
        ],
        correct: 1,
        explanation: 'At a four-way stop, the vehicle that arrives first has the right of way. If vehicles arrive simultaneously, the vehicle on the right has the right of way.',
        reference: 'SD Manual Ch.4, P.22',
        image: null
      },
      {
        id: 3,
        category: 'speed-limits',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'What is the speed limit in a school zone when children are present?',
        options: [
          '15 mph',
          '20 mph',
          '25 mph',
          '30 mph'
        ],
        correct: 1,
        explanation: 'The speed limit in school zones is typically 20 mph when children are present or during school hours.',
        reference: 'SD Manual Ch.5, P.31',
        image: null
      },
      {
        id: 4,
        category: 'parking',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'How far from a fire hydrant must you park?',
        options: [
          '5 feet',
          '10 feet',
          '15 feet',
          '20 feet'
        ],
        correct: 2,
        explanation: 'You must park at least 15 feet away from a fire hydrant to ensure emergency access.',
        reference: 'SD Manual Ch.6, P.45',
        image: null
      },
      {
        id: 5,
        category: 'traffic-signs',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'What does a yellow diamond-shaped sign typically indicate?',
        options: [
          'Construction zone',
          'Warning or caution',
          'No parking',
          'Speed limit'
        ],
        correct: 1,
        explanation: 'Yellow diamond-shaped signs are warning signs that alert drivers to potential hazards or changes in road conditions.',
        reference: 'SD Manual Ch.3, P.18',
        image: null
      },
      {
        id: 6,
        category: 'driving-laws',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'What is the legal blood alcohol content (BAC) limit for drivers under 21?',
        options: [
          '0.00%',
          '0.02%',
          '0.05%',
          '0.08%'
        ],
        correct: 1,
        explanation: 'South Dakota has a zero-tolerance policy for drivers under 21. Any detectable amount of alcohol (0.02% BAC or higher) is illegal.',
        reference: 'SD Manual Ch.8, P.67',
        image: null
      },
      {
        id: 7,
        category: 'road-signs',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What does a triangular red and white sign mean?',
        options: [
          'Stop',
          'Yield',
          'Do not enter',
          'Wrong way'
        ],
        correct: 1,
        explanation: 'A triangular red and white sign is a yield sign, meaning you must slow down and give the right of way to other traffic.',
        reference: 'SD Manual Ch.3, P.16',
        image: null
      },
      {
        id: 8,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What is the recommended following distance in good weather conditions?',
        options: [
          '1 second',
          '2 seconds',
          '3 seconds',
          '4 seconds'
        ],
        correct: 2,
        explanation: 'The 3-second rule is recommended for following distance in good weather conditions. This gives you enough time to react and stop safely.',
        reference: 'SD Manual Ch.7, P.52',
        image: null
      },
      {
        id: 9,
        category: 'intersections',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When making a left turn at an intersection with a green light, you should:',
        options: [
          'Turn immediately',
          'Yield to oncoming traffic',
          'Wait for the arrow',
          'Honk your horn'
        ],
        correct: 1,
        explanation: 'When making a left turn on a green light (not a green arrow), you must yield to oncoming traffic and pedestrians.',
        reference: 'SD Manual Ch.4, P.28',
        image: null
      },
      {
        id: 10,
        category: 'emergency-vehicles',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'When you see an emergency vehicle with flashing lights behind you, you should:',
        options: [
          'Speed up',
          'Pull over to the right and stop',
          'Continue at the same speed',
          'Pull over to the left'
        ],
        correct: 1,
        explanation: 'When an emergency vehicle approaches with lights and sirens, pull over to the right side of the road and come to a complete stop.',
        reference: 'SD Manual Ch.7, P.58',
        image: null
      }
    ];
  }

  // Get questions for study session
  getStudyQuestions(count = 10, category = null, difficulty = null) {
    let availableQuestions = [...this.questions];

    // Filter by category if specified
    if (category) {
      availableQuestions = availableQuestions.filter(q => q.category === category);
    }

    // Filter by difficulty if specified
    if (difficulty) {
      availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
    }

    // Shuffle questions
    availableQuestions = this.shuffleArray(availableQuestions);

    // Return requested count
    return availableQuestions.slice(0, count);
  }

  // Get questions for mock test (25 questions, mixed categories)
  getMockTestQuestions() {
    const categories = this.getCategories();
    const questionsPerCategory = Math.floor(25 / categories.length);
    const mockQuestions = [];

    categories.forEach(category => {
      const categoryQuestions = this.questions.filter(q => q.category === category);
      const shuffled = this.shuffleArray(categoryQuestions);
      mockQuestions.push(...shuffled.slice(0, questionsPerCategory));
    });

    // Fill remaining slots with random questions
    while (mockQuestions.length < 25) {
      const remaining = this.questions.filter(q => !mockQuestions.includes(q));
      if (remaining.length === 0) break;
      const randomQuestion = remaining[Math.floor(Math.random() * remaining.length)];
      mockQuestions.push(randomQuestion);
    }

    return this.shuffleArray(mockQuestions).slice(0, 25);
  }

  // Get questions for weak areas
  getWeakAreaQuestions(weakAreas, count = 15) {
    const weakQuestions = this.questions.filter(q =>
      weakAreas.includes(q.category)
    );

    return this.shuffleArray(weakQuestions).slice(0, count);
  }

  // Get road sign questions specifically
  getRoadSignQuestions(count = 20) {
    const roadSignCategories = ['traffic-signs', 'road-signs', 'warning-signs'];
    const roadSignQuestions = this.questions.filter(q =>
      roadSignCategories.includes(q.category)
    );

    return this.shuffleArray(roadSignQuestions).slice(0, count);
  }

  // Start a study session
  startStudySession(options = {}) {
    const {
      count = 10,
      category = null,
      difficulty = null,
      mode = 'study'
    } = options;

    let questions;

    switch (mode) {
      case 'mock-test':
        questions = this.getMockTestQuestions();
        break;
      case 'weak-areas':
        const weakAreas = window.State?.getProgress().weakAreas || [];
        questions = this.getWeakAreaQuestions(weakAreas, count);
        break;
      case 'road-signs':
        questions = this.getRoadSignQuestions(count);
        break;
      default:
        questions = this.getStudyQuestions(count, category, difficulty);
    }

    this.sessionQuestions = questions;
    this.currentIndex = 0;
    this.currentQuestion = questions[0] || null;

    // Update state
    if (window.State) {
      window.State.startSession(mode);
      window.State.setSessionData({
        totalQuestions: questions.length,
        questionIndex: 0,
        currentQuestion: this.currentQuestion
      });
    }

    // Update UI
    this.updateQuestionUI();

    return this.currentQuestion;
  }

  // Get next question
  nextQuestion() {
    if (this.currentIndex < this.sessionQuestions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = this.sessionQuestions[this.currentIndex];

      // Update state
      if (window.State) {
        window.State.setSessionData({
          questionIndex: this.currentIndex,
          currentQuestion: this.currentQuestion
        });
      }

      this.updateQuestionUI();
      return this.currentQuestion;
    }

    return null; // End of session
  }

  // Answer current question
  answerQuestion(selectedIndex) {
    if (!this.currentQuestion) return null;

    const correct = selectedIndex === this.currentQuestion.correct;
    const result = {
      correct,
      selectedIndex,
      correctIndex: this.currentQuestion.correct,
      explanation: this.currentQuestion.explanation,
      reference: this.currentQuestion.reference,
      question: this.currentQuestion
    };

    // Update state
    if (window.State) {
      window.State.answerQuestion(correct, this.currentQuestion.category);
    }

    return result;
  }

  // Update question UI
  updateQuestionUI() {
    if (!this.currentQuestion) return;

    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const questionCounter = document.getElementById('questionCounter');
    const questionImage = document.getElementById('questionImage');

    if (questionText) {
      questionText.textContent = this.currentQuestion.question;
    }

    if (questionCounter) {
      questionCounter.textContent = `${this.currentIndex + 1}/${this.sessionQuestions.length}`;
    }

    if (questionImage && this.currentQuestion.image) {
      questionImage.style.display = 'block';
      const img = questionImage.querySelector('img');
      if (img) {
        img.src = this.currentQuestion.image;
        img.alt = 'Question image';
      }
    } else if (questionImage) {
      questionImage.style.display = 'none';
    }

    if (answerOptions) {
      answerOptions.innerHTML = '';
      this.currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.addEventListener('click', () => this.handleAnswerClick(index));
        answerOptions.appendChild(button);
      });
    }
  }

  // Handle answer click
  handleAnswerClick(selectedIndex) {
    const result = this.answerQuestion(selectedIndex);
    this.showFeedback(result);
  }

  // Show feedback
  showFeedback(result) {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackHeader = document.getElementById('feedbackHeader');
    const correctAnswer = document.getElementById('correctAnswer');
    const explanation = document.getElementById('explanation');
    const reference = document.getElementById('reference');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');

    if (!feedbackContainer) return;

    // Update feedback content
    if (feedbackHeader) {
      feedbackHeader.textContent = result.correct ?
        '✓ Correct! +10 XP' :
        '✗ Incorrect';
      feedbackHeader.className = `feedback-header ${result.correct ? 'correct' : 'incorrect'}`;
    }

    if (correctAnswer) {
      const correctOption = result.question.options[result.correctIndex];
      correctAnswer.textContent = `Correct Answer: ${String.fromCharCode(65 + result.correctIndex)}) ${correctOption}`;
    }

    if (explanation) {
      explanation.textContent = result.explanation;
    }

    if (reference) {
      reference.textContent = `Reference: ${result.reference}`;
    }

    // Setup next button
    if (nextQuestionBtn) {
      nextQuestionBtn.onclick = () => {
        feedbackContainer.style.display = 'none';
        const nextQ = this.nextQuestion();
        if (!nextQ) {
          this.endSession();
        }
      };
    }

    // Show feedback
    feedbackContainer.style.display = 'block';

    // Disable answer options
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach((option, index) => {
      option.disabled = true;
      if (index === result.correctIndex) {
        option.classList.add('correct');
      } else if (index === result.selectedIndex && !result.correct) {
        option.classList.add('incorrect');
      }
    });
  }

  // End session
  endSession() {
    if (window.State) {
      window.State.endSession();
    }

    // Show results or return to home
    if (window.app) {
      window.app.showScreen('home');
    }

    // Reset session data
    this.sessionQuestions = [];
    this.currentQuestion = null;
    this.currentIndex = 0;
  }

  // Utility methods
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getCategories() {
    const categories = [...new Set(this.questions.map(q => q.category))];
    return categories.sort();
  }

  getDifficulties() {
    const difficulties = [...new Set(this.questions.map(q => q.difficulty))];
    return difficulties.sort();
  }

  getQuestionCount() {
    return this.questions.length;
  }

  getCategoryStats() {
    const stats = {};
    this.getCategories().forEach(category => {
      const categoryQuestions = this.questions.filter(q => q.category === category);
      stats[category] = {
        total: categoryQuestions.length,
        easy: categoryQuestions.filter(q => q.difficulty === 'easy').length,
        medium: categoryQuestions.filter(q => q.difficulty === 'medium').length,
        hard: categoryQuestions.filter(q => q.difficulty === 'hard').length
      };
    });
    return stats;
  }
}

// Create global instance
window.Questions = new QuestionManager();
