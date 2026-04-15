// Não to usando mais, foi para testes

import { Tweet } from "../types/Tweet"

export function getMockTweets(): Tweet[] {

  return [
    {
      id: "1",
      text: "I love this performance, amazing show",
      author: "user1",
      createdAt: "2026-01-01T10:00:00Z",
      likes: 10
    },
    {
      id: "2",
      text: "This concert was terrible and awful",
      author: "user2",
      createdAt: "2026-01-01T10:00:00Z",
      likes: 2
    },
    {
      id: "3",
      text: "Chappell Roan performed tonight",
      author: "user3",
      createdAt: "2026-01-01T10:00:00Z",
      likes: 5
    },
    {
      id: "4",
      text: "Great show tonight, fantastic performance",
      author: "user4",
      createdAt: "2026-01-01T11:00:00Z",
      likes: 20
    },
    {
      id: "5",
      text: "Worst show ever, I hate it",
      author: "user5",
      createdAt: "2026-01-01T11:00:00Z",
      likes: 1
    }
  ]

}