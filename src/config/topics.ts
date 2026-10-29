export type SubjectCategory = 'logic-building' | 'data-structures' | 'algorithms' | 'operating-systems' | 'computer-networks' | 'database-management';

export interface TopicConfig {
    id: string;
    slug: string;
    title: string;
    category: SubjectCategory;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    status: 'active' | 'coming-soon';
}

export const TOPICS_CONFIG: TopicConfig[] = [

    // Logic Building topics
    { id: '1', slug: 'conditionals', title: 'Conditionals', category: 'logic-building', difficulty: 'Beginner', status: 'active' },
    { id: '2', slug: 'loops', title: 'Loops', category: 'logic-building', difficulty: 'Intermediate', status: 'active' },
    { id: '3', slug: 'functions', title: 'Functions', category: 'logic-building', difficulty: 'Beginner', status: 'active' },
    { id: '4', slug: 'recursion', title: 'Recursion', category: 'logic-building', difficulty: 'Intermediate', status: 'active' },

    // Data Structures topics
    { id: '5', slug: 'arrays', title: 'Arrays', category: 'data-structures', difficulty: 'Beginner', status: 'active' },
    { id: '6', slug: 'linked-lists', title: 'Linked Lists', category: 'data-structures', difficulty: 'Beginner', status: 'active' },
    { id: '7', slug: 'hashing', title: 'Hashing', category: 'data-structures', difficulty: 'Intermediate', status: 'active' },
    { id: '8', slug: 'strings', title: 'Strings', category: 'data-structures', difficulty: 'Beginner', status: 'active' },
    { id: '9', slug: 'stacks', title: 'Stacks', category: 'data-structures', difficulty: 'Beginner', status: 'active' },
    { id: '10', slug: 'queues', title: 'Queues', category: 'data-structures', difficulty: 'Beginner', status: 'active' },
    { id: '11', slug: 'trees', title: 'Trees', category: 'data-structures', difficulty: 'Intermediate', status: 'active' },
    { id: '12', slug: 'graphs', title: 'Graphs', category: 'data-structures', difficulty: 'Advanced', status: 'active' },
    { id: '13', slug: 'heaps', title: 'Heaps', category: 'data-structures', difficulty: 'Intermediate', status: 'active' },


    // Placeholder topics for other categories
    { id: '101', slug: 'sorting', title: 'Sorting Algorithms', category: 'algorithms', difficulty: 'Intermediate', status: 'coming-soon' },
    { id: '201', slug: 'process-scheduling', title: 'Process Scheduling', category: 'operating-systems', difficulty: 'Intermediate', status: 'coming-soon' },
];

export const SUBJECTS_CONFIG = [
    { id: 'logic-building', title: 'Logic Building', icon: '🧠', description: 'Master fundamental programming concepts.' },
    { id: 'data-structures', title: 'Data Structures', icon: '📦', description: 'Master foundational data organizations.' },
    { id: 'algorithms', title: 'Algorithms', icon: '⚡', description: 'Step-by-step logic for complex problems.' },
    { id: 'operating-systems', title: 'Operating Systems', icon: '🖥️', description: 'Learn how software manages hardware.' },
    { id: 'database-management', title: 'DBMS', icon: '🗄️', description: 'Understand data storage and retrieval.' },
];
