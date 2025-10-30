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

    // Use embedded questions directly to avoid CORS issues
    this.questions = this.getAllQuestions();
    this.isLoaded = true;
    console.log(`✅ Loaded ${this.questions.length} questions`);
    console.log('First question:', this.questions[0]?.question);
    console.log('Categories available:', this.getCategories());
  }

  getAllQuestions() {
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
      },
      {
        id: 11,
        category: 'traffic-signs',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What does a circular sign with a red border and diagonal line mean?',
        options: [
          'Warning',
          'Information',
          'Prohibition (not allowed)',
          'Construction zone'
        ],
        correct: 2,
        explanation: 'Circular signs with red borders and diagonal lines are prohibition signs, indicating something is not allowed.',
        reference: 'SD Manual Ch.3, P.20',
        image: null
      },
      {
        id: 12,
        category: 'speed-limits',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What is the maximum speed limit on South Dakota interstate highways?',
        options: [
          '70 mph',
          '75 mph',
          '80 mph',
          '85 mph'
        ],
        correct: 2,
        explanation: 'The maximum speed limit on South Dakota interstate highways is 80 mph, unless otherwise posted.',
        reference: 'SD Manual Ch.5, P.33',
        image: null
      },
      {
        id: 13,
        category: 'parking',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'You cannot park within how many feet of a crosswalk?',
        options: [
          '10 feet',
          '15 feet',
          '20 feet',
          '25 feet'
        ],
        correct: 2,
        explanation: 'You cannot park within 20 feet of a crosswalk to ensure pedestrian visibility and safety.',
        reference: 'SD Manual Ch.6, P.47',
        image: null
      },
      {
        id: 14,
        category: 'right-of-way',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When entering a highway from an on-ramp, you should:',
        options: [
          'Stop and wait for an opening',
          'Merge at any speed',
          'Accelerate to match traffic speed',
          'Use your hazard lights'
        ],
        correct: 2,
        explanation: 'When entering a highway, accelerate to match the speed of traffic and merge safely when there\'s an adequate gap.',
        reference: 'SD Manual Ch.4, P.35',
        image: null
      },
      {
        id: 15,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'In wet weather conditions, you should increase your following distance to:',
        options: [
          '3 seconds',
          '4 seconds',
          '5 seconds',
          '6 seconds'
        ],
        correct: 2,
        explanation: 'In wet conditions, increase your following distance to at least 5 seconds to account for reduced traction and longer stopping distances.',
        reference: 'SD Manual Ch.7, P.54',
        image: null
      },
      {
        id: 16,
        category: 'driving-laws',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'Using a handheld cell phone while driving is:',
        options: [
          'Always legal',
          'Legal only for emergencies',
          'Illegal for all drivers',
          'Legal only for adults'
        ],
        correct: 2,
        explanation: 'Using a handheld cell phone while driving is illegal for all drivers in South Dakota.',
        reference: 'SD Manual Ch.8, P.72',
        image: null
      },
      {
        id: 17,
        category: 'intersections',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'At a roundabout, you should:',
        options: [
          'Stop before entering',
          'Yield to traffic in the roundabout',
          'Speed up to merge quickly',
          'Use your left turn signal'
        ],
        correct: 1,
        explanation: 'When entering a roundabout, yield to traffic already in the roundabout and enter when there\'s a safe gap.',
        reference: 'SD Manual Ch.4, P.30',
        image: null
      },
      {
        id: 18,
        category: 'road-signs',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'A rectangular white sign with black text typically indicates:',
        options: [
          'Warning',
          'Regulatory information',
          'Construction',
          'Tourist information'
        ],
        correct: 1,
        explanation: 'Rectangular white signs with black text are regulatory signs that tell you about traffic laws and regulations.',
        reference: 'SD Manual Ch.3, P.19',
        image: null
      },
      {
        id: 19,
        category: 'emergency-vehicles',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'When stopped for an emergency vehicle, you should remain stopped until:',
        options: [
          'The vehicle passes',
          'The lights turn off',
          'The vehicle is out of sight',
          'Other traffic starts moving'
        ],
        correct: 0,
        explanation: 'Remain stopped until the emergency vehicle has completely passed and it\'s safe to proceed.',
        reference: 'SD Manual Ch.7, P.59',
        image: null
      },
      {
        id: 20,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When driving in fog, you should:',
        options: [
          'Use high beam headlights',
          'Use low beam headlights',
          'Use hazard lights',
          'Turn off all lights'
        ],
        correct: 1,
        explanation: 'In fog, use low beam headlights. High beams reflect off the fog and reduce visibility.',
        reference: 'SD Manual Ch.7, P.61',
        image: null
      },
      {
        id: 21,
        category: 'parking',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'When parking on a hill with a curb, you should:',
        options: [
          'Always turn wheels toward the curb',
          'Always turn wheels away from the curb',
          'Turn wheels toward curb when facing downhill',
          'Leave wheels straight'
        ],
        correct: 2,
        explanation: 'When parking downhill with a curb, turn wheels toward the curb. When parking uphill, turn wheels away from the curb.',
        reference: 'SD Manual Ch.6, P.49',
        image: null
      },
      {
        id: 22,
        category: 'speed-limits',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'In residential areas, the speed limit is typically:',
        options: [
          '20 mph',
          '25 mph',
          '30 mph',
          '35 mph'
        ],
        correct: 1,
        explanation: 'In residential areas, the typical speed limit is 25 mph unless otherwise posted.',
        reference: 'SD Manual Ch.5, P.32',
        image: null
      },
      {
        id: 23,
        category: 'right-of-way',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'Pedestrians in a crosswalk have the right of way:',
        options: [
          'Only at traffic lights',
          'Only in school zones',
          'At all marked crosswalks',
          'Never'
        ],
        correct: 2,
        explanation: 'Pedestrians have the right of way at all marked crosswalks, whether controlled by signals or not.',
        reference: 'SD Manual Ch.4, P.25',
        image: null
      },
      {
        id: 24,
        category: 'driving-laws',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'If you are involved in an accident, you must report it to police if:',
        options: [
          'Anyone is injured',
          'Damage exceeds $2,000',
          'Both A and B',
          'Only if someone dies'
        ],
        correct: 2,
        explanation: 'You must report an accident to police if anyone is injured or if property damage exceeds $2,000.',
        reference: 'SD Manual Ch.8, P.75',
        image: null
      },
      {
        id: 25,
        category: 'intersections',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'A flashing red light at an intersection means:',
        options: [
          'Proceed with caution',
          'Treat it as a stop sign',
          'Yield to cross traffic',
          'Speed up to clear the intersection'
        ],
        correct: 1,
        explanation: 'A flashing red light should be treated as a stop sign - come to a complete stop and proceed when safe.',
        reference: 'SD Manual Ch.4, P.27',
        image: null
      },
      {
        id: 26,
        category: 'traffic-signs',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What does a pentagon-shaped sign indicate?',
        options: [
          'School zone',
          'Hospital zone',
          'Construction zone',
          'Residential zone'
        ],
        correct: 0,
        explanation: 'Pentagon-shaped signs are used for school zones and school crossings.',
        reference: 'SD Manual Ch.3, P.21',
        image: null
      },
      {
        id: 27,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When driving at night, you should dim your headlights when within how many feet of an oncoming vehicle?',
        options: [
          '300 feet',
          '400 feet',
          '500 feet',
          '600 feet'
        ],
        correct: 2,
        explanation: 'Dim your headlights when within 500 feet of an oncoming vehicle to avoid blinding the other driver.',
        reference: 'SD Manual Ch.7, P.63',
        image: null
      },
      {
        id: 28,
        category: 'driving-laws',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What is the minimum age to get a learner\'s permit in South Dakota?',
        options: [
          '14 years old',
          '15 years old',
          '16 years old',
          '17 years old'
        ],
        correct: 0,
        explanation: 'In South Dakota, you can get a learner\'s permit at age 14.',
        reference: 'SD Manual Ch.1, P.5',
        image: null
      },
      {
        id: 29,
        category: 'intersections',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When two vehicles arrive at an uncontrolled intersection at the same time, who has the right of way?',
        options: [
          'The vehicle on the left',
          'The vehicle on the right',
          'The larger vehicle',
          'The faster vehicle'
        ],
        correct: 1,
        explanation: 'When two vehicles arrive simultaneously at an uncontrolled intersection, the vehicle on the right has the right of way.',
        reference: 'SD Manual Ch.4, P.24',
        image: null
      },
      {
        id: 30,
        category: 'parking',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'You cannot park within how many feet of a stop sign?',
        options: [
          '15 feet',
          '20 feet',
          '25 feet',
          '30 feet'
        ],
        correct: 3,
        explanation: 'You cannot park within 30 feet of a stop sign to ensure visibility for other drivers.',
        reference: 'SD Manual Ch.6, P.48',
        image: null
      },
      {
        id: 31,
        category: 'road-signs',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'What color are construction zone signs?',
        options: [
          'Yellow',
          'Orange',
          'Red',
          'Blue'
        ],
        correct: 1,
        explanation: 'Construction zone signs are orange to alert drivers to work zones and temporary conditions.',
        reference: 'SD Manual Ch.3, P.22',
        image: null
      },
      {
        id: 32,
        category: 'emergency-vehicles',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'How far must you stay behind an emergency vehicle with flashing lights?',
        options: [
          '100 feet',
          '200 feet',
          '300 feet',
          '500 feet'
        ],
        correct: 3,
        explanation: 'You must stay at least 500 feet behind an emergency vehicle with flashing lights.',
        reference: 'SD Manual Ch.7, P.60',
        image: null
      },
      {
        id: 33,
        category: 'right-of-way',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'When making a right turn on red, you must:',
        options: [
          'Turn immediately if clear',
          'Come to a complete stop first',
          'Yield to pedestrians only',
          'Wait for the green light'
        ],
        correct: 1,
        explanation: 'When making a right turn on red, you must come to a complete stop and yield to all traffic and pedestrians before turning.',
        reference: 'SD Manual Ch.4, P.29',
        image: null
      },
      {
        id: 34,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'When should you use your hazard lights?',
        options: [
          'When parking illegally',
          'When your vehicle is disabled',
          'When driving slowly',
          'When it\'s raining'
        ],
        correct: 1,
        explanation: 'Use hazard lights when your vehicle is disabled or stopped on the roadway to warn other drivers.',
        reference: 'SD Manual Ch.7, P.65',
        image: null
      },
      {
        id: 35,
        category: 'traffic-signs',
        type: 'multiple-choice',
        difficulty: 'easy',
        question: 'What does a green circular sign with a white arrow mean?',
        options: [
          'Turn required',
          'Turn permitted',
          'No turn allowed',
          'Yield before turning'
        ],
        correct: 1,
        explanation: 'A green circular sign with a white arrow indicates that the turn shown is permitted.',
        reference: 'SD Manual Ch.3, P.23',
        image: null
      },
      {
        id: 36,
        category: 'speed-limits',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What is the speed limit in business districts unless otherwise posted?',
        options: [
          '20 mph',
          '25 mph',
          '30 mph',
          '35 mph'
        ],
        correct: 1,
        explanation: 'The speed limit in business districts is 25 mph unless otherwise posted.',
        reference: 'SD Manual Ch.5, P.34',
        image: null
      },
      {
        id: 37,
        category: 'intersections',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What should you do when approaching a yellow traffic light?',
        options: [
          'Speed up to get through',
          'Stop if you can do so safely',
          'Always stop immediately',
          'Ignore it and continue'
        ],
        correct: 1,
        explanation: 'When approaching a yellow light, stop if you can do so safely. If you cannot stop safely, proceed with caution.',
        reference: 'SD Manual Ch.4, P.26',
        image: null
      },
      {
        id: 38,
        category: 'parking',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'When parallel parking, your vehicle should be within how many inches of the curb?',
        options: [
          '6 inches',
          '12 inches',
          '18 inches',
          '24 inches'
        ],
        correct: 1,
        explanation: 'When parallel parking, your vehicle should be within 12 inches of the curb.',
        reference: 'SD Manual Ch.6, P.50',
        image: null
      },
      {
        id: 39,
        category: 'road-signs',
        type: 'multiple-choice',
        difficulty: 'medium',
        question: 'What does a brown sign typically indicate?',
        options: [
          'Construction zone',
          'Recreation area',
          'Hospital',
          'School zone'
        ],
        correct: 1,
        explanation: 'Brown signs indicate recreational areas, parks, and points of interest.',
        reference: 'SD Manual Ch.3, P.24',
        image: null
      },
      {
        id: 40,
        category: 'safe-driving',
        type: 'multiple-choice',
        difficulty: 'hard',
        question: 'What is hydroplaning?',
        options: [
          'Skidding on ice',
          'Losing traction on wet roads',
          'Sliding on gravel',
          'Spinning out on curves'
        ],
        correct: 1,
        explanation: 'Hydroplaning occurs when your tires lose contact with the road surface due to water, causing loss of traction and control.',
        reference: 'SD Manual Ch.7, P.66',
        image: null
      }
    ];
  }

  // Get questions for study session with better variety
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

    // If no specific filters, ensure variety across categories and difficulties
    if (!category && !difficulty) {
      availableQuestions = this.getVariedQuestions(count);
    } else {
      // Shuffle questions
      availableQuestions = this.shuffleArray(availableQuestions);
    }

    // Return requested count
    return availableQuestions.slice(0, count);
  }

  // Get varied questions across categories and difficulties
  getVariedQuestions(count) {
    const categories = this.getCategories();
    const difficulties = ['easy', 'medium', 'hard'];
    const questionsPerCategory = Math.ceil(count / categories.length);
    const selectedQuestions = [];

    // Get questions from each category
    categories.forEach(category => {
      const categoryQuestions = this.questions.filter(q => q.category === category);

      // Get mix of difficulties within category
      const easyQuestions = categoryQuestions.filter(q => q.difficulty === 'easy');
      const mediumQuestions = categoryQuestions.filter(q => q.difficulty === 'medium');
      const hardQuestions = categoryQuestions.filter(q => q.difficulty === 'hard');

      const categorySelection = [];

      // Add one from each difficulty if available
      if (easyQuestions.length > 0) {
        categorySelection.push(easyQuestions[Math.floor(Math.random() * easyQuestions.length)]);
      }
      if (mediumQuestions.length > 0) {
        categorySelection.push(mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)]);
      }
      if (hardQuestions.length > 0) {
        categorySelection.push(hardQuestions[Math.floor(Math.random() * hardQuestions.length)]);
      }

      // Fill remaining slots randomly from category
      while (categorySelection.length < questionsPerCategory && categorySelection.length < categoryQuestions.length) {
        const remaining = categoryQuestions.filter(q => !categorySelection.includes(q));
        if (remaining.length === 0) break;
        categorySelection.push(remaining[Math.floor(Math.random() * remaining.length)]);
      }

      selectedQuestions.push(...categorySelection);
    });

    // Shuffle final selection
    return this.shuffleArray(selectedQuestions);
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
    console.log('🎯 Answering question:', {
      correct,
      category: this.currentQuestion.category,
      question: this.currentQuestion.question
    });

    if (window.State) {
      console.log('📊 Calling State.answerQuestion...');
      window.State.answerQuestion(correct, this.currentQuestion.category);

      // Log updated stats
      const userData = window.State.getUserData();
      console.log('📈 Updated user data:', {
        totalQuestions: userData.totalQuestions,
        correctAnswers: userData.correctAnswers,
        xp: userData.xp
      });
    } else {
      console.error('❌ window.State is not available!');
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
    console.log('🏁 Questions.endSession() called');
    const sessionData = window.State?.getSessionData();
    console.log('📊 Session data before ending:', sessionData);

    if (window.State) {
      console.log('🔄 Calling State.endSession()...');
      window.State.endSession();
    } else {
      console.error('❌ State manager not available in endSession!');
    }

    // Show session summary with motivational messages
    if (sessionData && sessionData.totalQuestions > 0) {
      const accuracy = Math.round((sessionData.correctAnswers / sessionData.totalQuestions) * 100);
      const xpEarned = sessionData.correctAnswers * 10;

      let motivationalMessage = '';
      let messageType = 'success';

      if (accuracy >= 90) {
        motivationalMessage = '🔥 AMAZING! You\'re crushing it! ';
        if (window.Game) window.Game.showCelebration();
      } else if (accuracy >= 80) {
        motivationalMessage = '🚀 Excellent work! You\'re getting ready! ';
      } else if (accuracy >= 70) {
        motivationalMessage = '💪 Good progress! Keep it up! ';
      } else if (accuracy >= 60) {
        motivationalMessage = '📚 You\'re learning! Practice makes perfect! ';
      } else {
        motivationalMessage = '🎯 Every question helps you improve! ';
        messageType = 'warning';
      }

      const message = `${motivationalMessage}\n${sessionData.correctAnswers}/${sessionData.totalQuestions} correct (${accuracy}%)\n+${xpEarned} XP earned!`;

      if (window.app) {
        window.app.showNotification(message, messageType, 5000);
      }
    }

    // Update home screen data
    if (window.app) {
      // Refresh user data on home screen
      const userData = window.State?.getUserData();
      if (userData) {
        window.app.updateUserInfo(userData);
      }

      // Show home screen
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
