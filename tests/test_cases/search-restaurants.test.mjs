import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as when from '../steps/when.mjs'
import * as teardown from '../steps/teardown.mjs'
import * as given from '../steps/given.mjs'

const mode = process.env.TEST_MODE;

describe('Given an authenticated user', () => {
  let user

  beforeAll(async () => {
    // Only create Cognito users for e2e tests (http mode)
    // For integration tests (handler mode), we don't need any user
    if (mode === 'http') {
      user = await given.an_authenticated_user()
    }
    // For integration tests, user remains undefined
  })

  afterAll(async () => {
    // Only delete Cognito users for e2e tests
    if (mode === 'http') {
      await teardown.an_authenticated_user(user)
    }
  })

  describe(`When we invoke the POST /restaurants/search endpoint with theme 'cartoon'`, () => {
    it(`Should return an array of 4 restaurants`, async () => {
      const res = await when.we_invoke_search_restaurants('cartoon', user)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(4)

      for (const restaurant of res.body) {
        expect(restaurant).toHaveProperty('name')
        expect(restaurant).toHaveProperty('image')
      }
    })
  })
})