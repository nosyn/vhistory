import { db } from '../index';
import { blogPosts, words } from '../schema';

// Helper function to generate blog content
function generateBlogContent(titleKeyword: string): string {
  return `
    <h2>Introduction</h2>
    <p>This article explores the fascinating aspects of ${titleKeyword} in Vietnamese language and culture. Understanding these nuances helps us appreciate the rich diversity of Vietnamese dialects.</p>
    
    <h2>Historical Context</h2>
    <p>The evolution of Vietnamese language has been influenced by various historical events, regional migrations, and cultural exchanges. ${titleKeyword} represents one of the many unique features that emerged from this complex history.</p>
    
    <h3>Regional Variations</h3>
    <p>Different regions of Vietnam have developed their own distinctive ways of expressing concepts related to ${titleKeyword}. These variations reflect local culture, geography, and historical influences.</p>
    
    <h2>Modern Usage</h2>
    <p>In contemporary Vietnamese society, the usage patterns continue to evolve. Young people adapt traditional expressions while maintaining connections to their cultural heritage.</p>
    
    <blockquote>
      <p>"Language is the road map of a culture. It tells you where its people come from and where they are going." - Rita Mae Brown</p>
    </blockquote>
    
    <h2>Practical Examples</h2>
    <ul>
      <li>Common usage in daily conversation</li>
      <li>Formal contexts and written language</li>
      <li>Regional dialects and variations</li>
      <li>Contemporary slang and innovations</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>Understanding ${titleKeyword} provides insight into Vietnamese linguistic diversity. As we document these variations, we preserve an important part of cultural heritage for future generations.</p>
  `;
}

export async function seedBlogPosts() {
  console.log('🌱 Seeding 100 blog posts...');

  // Get some existing words to link to
  const existingWords = await db.select().from(words).limit(10);
  const wordIds = existingWords.map((w) => w.id);

  // Topics for generating varied blog posts
  const topics = [
    'Vietnamese Tones',
    'Regional Accents',
    'Pronunciation Guides',
    'Grammar Differences',
    'Vocabulary Variations',
    'Slang Terms',
    'Historical Linguistics',
    'Language Evolution',
    'Dialect Boundaries',
    'Urban vs Rural Speech',
    'Generational Language Change',
    'Borrowed Words',
    'French Influence',
    'Chinese Influence',
    'English Loanwords',
    'Formal vs Informal Speech',
    'Honorifics',
    'Family Terms',
    'Food Vocabulary',
    'Cultural Expressions',
    'Idioms and Proverbs',
    'Poetry and Literature',
    'Song Lyrics',
    'Modern Media',
    'Social Media Language',
    'Text Messaging',
    'Northern Dialect Features',
    'Central Dialect Characteristics',
    'Southern Dialect Traits',
    'Hanoi Speech Patterns',
    'Saigon Colloquialisms',
    'Hue Imperial Language',
    'Mekong Delta Expressions',
    'Highland Vietnamese',
    'Coastal Dialects',
    'Religious Vocabulary',
    'Buddhist Terms',
    'Confucian Influence',
    'Taoism',
    'Kinship Terminology',
    'Pronouns Usage',
    'Politeness Levels',
    'Age-based Speech',
    'Gender Language Differences',
    'Professional Jargon',
    'Academic Language',
    'Business Vietnamese',
    'Legal Terminology',
    'Medical Terms',
    'Technical Vocabulary',
    'Colors and Meanings',
    'Numbers and Superstitions',
    'Directional Words',
    'Time Expressions',
    'Weather Vocabulary',
    'Nature Terminology',
    'Animal Names',
    'Plant Names',
    'Clothing Terms',
    'Body Parts',
    'Emotions and Feelings',
    'Actions and Verbs',
    'Descriptive Adjectives',
    'Connecting Words',
    'Question Words',
    'Negative Expressions',
    'Affirmative Phrases',
    'Exclamations',
    'Greetings Variations',
    'Farewell Expressions',
    'Thanks and Apologies',
    'Market Language',
    'Street Food Vocabulary',
    'Restaurant Terms',
    'Shopping Phrases',
    'Transportation Words',
    'Travel Expressions',
    'Hotel and Accommodation',
    'Education Terminology',
    'School Vocabulary',
    'University Language',
    'Children Speech',
    'Baby Talk',
    'Teen Slang',
    'Elder Speech Patterns',
    'Minority Languages',
    'Ethnic Influences',
    'Cross-border Dialects',
    'Vietnamese Abroad',
    'Overseas Dialects',
    'Language Preservation',
    'Digital Age Language',
    'Gaming Terms',
    'Technology Vocabulary',
    'Internet Culture',
    'Memes and Viral Language',
    'Influencer Speech',
    'Traditional Arts',
    'Music Terminology',
    'Dance Vocabulary',
    'Theater Language',
    'Martial Arts Terms',
    'Sports Vocabulary',
    'Leisure Activities',
  ];

  const allPosts = [];

  // Generate 100 blog posts
  for (let i = 0; i < 100; i++) {
    const topic = topics[i % topics.length];
    const variation = Math.floor(i / topics.length) + 1;
    const titleSuffix = variation > 1 ? ` Part ${variation}` : '';

    const daysAgo = 1 + i; // Most recent to oldest
    const views = Math.floor(Math.random() * 800) + 50;
    const hasWord = Math.random() > 0.7; // 30% chance of having associated word

    allPosts.push({
      title: `${topic}${titleSuffix}`,
      slug: `${topic.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      excerpt: `An in-depth exploration of ${topic.toLowerCase()} and how it shapes Vietnamese communication across different regions and contexts.`,
      content: generateBlogContent(topic),
      authorId: `seed-author-${(i % 3) + 1}`,
      wordId:
        hasWord && wordIds.length > 0 ? wordIds[i % wordIds.length] : null,
      published: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      viewCount: views,
    });
  }

  try {
    let count = 0;
    for (const post of allPosts) {
      await db.insert(blogPosts).values(post);
      count++;
      if (count % 10 === 0) {
        console.log(`✅ Created ${count} blog posts...`);
      }
    }

    console.log(`✅ Successfully seeded ${allPosts.length} blog posts`);
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedBlogPosts()
    .then(() => {
      console.log('✅ Blog seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Blog seeding failed:', error);
      process.exit(1);
    });
}
