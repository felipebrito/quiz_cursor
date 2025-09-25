import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...')
    
    // Test creating a participant
    console.log('📝 Creating a test participant...')
    const participant = await prisma.participant.create({
      data: {
        name: 'Test User',
        selfieUrl: 'https://example.com/selfie.jpg'
      }
    })
    console.log('✅ Participant created:', participant)

    // Test reading the participant
    console.log('📖 Reading participant...')
    const foundParticipant = await prisma.participant.findUnique({
      where: { id: participant.id }
    })
    console.log('✅ Participant found:', foundParticipant)

    // Test creating a game
    console.log('🎮 Creating a test game...')
    const game = await prisma.game.create({
      data: {
        code: 'TEST123',
        status: 'WAITING'
      }
    })
    console.log('✅ Game created:', game)

    // Test creating a game participant
    console.log('👥 Creating game participant...')
    const gameParticipant = await prisma.gameParticipant.create({
      data: {
        gameId: game.id,
        participantId: participant.id,
        score: 0
      }
    })
    console.log('✅ Game participant created:', gameParticipant)

    // Test creating a question
    console.log('❓ Creating a test question...')
    const question = await prisma.question.create({
      data: {
        gameId: game.id,
        text: 'What is the capital of France?',
        options: JSON.stringify(['London', 'Paris', 'Berlin', 'Madrid']),
        correctAnswerIndex: 1,
        imageUrl: 'https://example.com/france.jpg'
      }
    })
    console.log('✅ Question created:', question)

    // Test creating an answer
    console.log('💭 Creating a test answer...')
    const answer = await prisma.answer.create({
      data: {
        questionId: question.id,
        gameParticipantId: gameParticipant.id,
        selectedOptionIndex: 1,
        isCorrect: true
      }
    })
    console.log('✅ Answer created:', answer)

    // Test reading all data with relations
    console.log('🔍 Testing relations...')
    const fullGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        participants: {
          include: {
            participant: true,
            answers: {
              include: {
                question: true
              }
            }
          }
        },
        questions: true
      }
    })
    console.log('✅ Full game data with relations:', JSON.stringify(fullGame, null, 2))

    // Clean up test data
    console.log('🧹 Cleaning up test data...')
    await prisma.answer.deleteMany({ where: { gameParticipantId: gameParticipant.id } })
    await prisma.question.deleteMany({ where: { gameId: game.id } })
    await prisma.gameParticipant.deleteMany({ where: { gameId: game.id } })
    await prisma.game.delete({ where: { id: game.id } })
    await prisma.participant.delete({ where: { id: participant.id } })
    console.log('✅ Test data cleaned up')

    console.log('🎉 All database tests passed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()
