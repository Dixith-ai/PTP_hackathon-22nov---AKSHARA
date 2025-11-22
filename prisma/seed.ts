import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@akshara.com' },
    update: {},
    create: {
      email: 'test@akshara.com',
      password: hashedPassword,
      name: 'Test User',
      username: 'testuser',
      learningStyle: 'Visual',
      studyHours: 3,
      goals: 'Learn React and TypeScript',
      interests: 'Programming, Web Development, Design',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      bio: 'Learning to build amazing things!',
    },
  })

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to React',
      tagline: 'Build modern UIs with React',
      description: 'Learn the fundamentals of React including components, hooks, and state management.',
      category: 'Programming',
      difficulty: 'beginner',
      duration: 120,
      lessonCount: 5,
      instructor: 'Jane Doe',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Getting Started with React',
            content: 'Introduction to React and its core concepts.',
            order: 1,
            duration: 20,
          },
          {
            title: 'Components and Props',
            content: 'Learn how to create and use React components.',
            order: 2,
            duration: 25,
          },
          {
            title: 'State and Hooks',
            content: 'Understanding state management with hooks.',
            order: 3,
            duration: 30,
          },
        ],
      },
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced TypeScript',
      tagline: 'Master TypeScript for production',
      description: 'Deep dive into TypeScript advanced features and patterns.',
      category: 'Programming',
      difficulty: 'intermediate',
      duration: 180,
      lessonCount: 6,
      instructor: 'John Smith',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Type System Deep Dive',
            content: 'Understanding TypeScript\'s type system.',
            order: 1,
            duration: 30,
          },
        ],
      },
    },
  })

  console.log('✅ Created courses')

  // Create sample habits
  await prisma.habit.create({
    data: {
      userId: user.id,
      title: 'Read for 15 minutes',
      description: 'Daily reading habit',
      type: 'daily',
      difficulty: 'easy',
    },
  })

  await prisma.habit.create({
    data: {
      userId: user.id,
      title: 'Practice coding',
      description: 'Code for at least 30 minutes',
      type: 'daily',
      difficulty: 'medium',
    },
  })

  console.log('✅ Created habits')

  // Create initial streak
  await prisma.streak.create({
    data: {
      userId: user.id,
      type: 'daily',
      count: 1,
    },
  })

  console.log('✅ Created streak')

  // Create sample emotion
  await prisma.emotion.create({
    data: {
      userId: user.id,
      mood: 'focused',
      intensity: 7,
    },
  })

  console.log('✅ Created emotion')

  // Create sample notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'streak',
      title: 'Streak Started! 🔥',
      message: 'You\'ve started a new learning streak. Keep it up!',
      link: '/home',
    },
  })

  console.log('✅ Created notification')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


