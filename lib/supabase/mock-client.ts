import { getMockData } from "@/lib/mock-data"

const mockAdminUser = {
  id: "mock-admin-user-001",
  email: "admin@pranaplanner.com",
  full_name: "Demo Admin",
  role: "admin",
  avatar_url: "/admin-user-avatar.png",
}

export function createMockSupabaseClient() {
  const mockData = getMockData()

  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: {
              id: mockAdminUser.id,
              email: mockAdminUser.email,
              user_metadata: mockAdminUser,
            },
          },
          error: null,
        }
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        return {
          data: {
            user: {
              id: mockAdminUser.id,
              email: mockAdminUser.email,
              user_metadata: mockAdminUser,
            },
            session: { access_token: "mock-token" },
          },
          error: null,
        }
      },
      async signUp({ email, password }: { email: string; password: string }) {
        return {
          data: {
            user: {
              id: "new-user-" + Date.now(),
              email,
              user_metadata: {},
            },
            session: null,
          },
          error: null,
        }
      },
      async signOut() {
        return { error: null }
      },
    },
    from(table: string) {
      return {
        select(columns?: string) {
          const data = getMockTableData(table, mockData)
          return createQueryBuilder(data, table, mockData)
        },
        insert(data: any) {
          return createMutationBuilder(data)
        },
        update(data: any) {
          return createMutationBuilder(data)
        },
        delete() {
          return createMutationBuilder(null)
        },
      }
    },
  }
}

function createMutationBuilder(inputData: any) {
  const builder: any = {
    data: inputData,
    error: null,
    eq(column: string, value: any) {
      return builder
    },
    neq(column: string, value: any) {
      return builder
    },
    single() {
      return { data: inputData, error: null }
    },
    select(columns?: string) {
      return {
        data: [inputData],
        error: null,
        single() {
          return { data: inputData, error: null }
        },
      }
    },
  }
  return builder
}

function createQueryBuilder(initialData: any[], table: string, mockData: any) {
  const filteredData = [...(initialData || [])]

  const createChainableBuilder = (data: any[]): any => {
    return {
      data,
      error: null,
      eq(column: string, value: any) {
        if (table === "profiles" && column === "id") {
          const adminProfile = { id: value, role: "admin", full_name: "Demo Admin" }
          return createChainableBuilder([adminProfile])
        }
        const newData = data.filter((item: any) => item && item[column] === value)
        return createChainableBuilder(newData)
      },
      neq(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] !== value)
        return createChainableBuilder(newData)
      },
      gt(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] > value)
        return createChainableBuilder(newData)
      },
      gte(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] >= value)
        return createChainableBuilder(newData)
      },
      lt(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] < value)
        return createChainableBuilder(newData)
      },
      lte(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] <= value)
        return createChainableBuilder(newData)
      },
      in(column: string, values: any[]) {
        const newData = data.filter((item: any) => item && values.includes(item[column]))
        return createChainableBuilder(newData)
      },
      is(column: string, value: any) {
        const newData = data.filter((item: any) => item && item[column] === value)
        return createChainableBuilder(newData)
      },
      or(conditions: string) {
        return createChainableBuilder(data)
      },
      order(column: string, options?: { ascending?: boolean }) {
        const sorted = [...data].sort((a, b) => {
          if (!a || !b) return 0
          const aVal = a[column]
          const bVal = b[column]
          if (options?.ascending === false) {
            return bVal > aVal ? 1 : -1
          }
          return aVal > bVal ? 1 : -1
        })
        return createChainableBuilder(sorted)
      },
      limit(count: number) {
        return createChainableBuilder(data.slice(0, count))
      },
      range(from: number, to: number) {
        return createChainableBuilder(data.slice(from, to + 1))
      },
      single() {
        return { data: data[0] || null, error: null }
      },
      maybeSingle() {
        return { data: data[0] || null, error: null }
      },
      then(resolve: (value: any) => void) {
        resolve({ data, error: null })
      },
    }
  }

  return createChainableBuilder(filteredData)
}

function getMockTableData(table: string, mockData: any) {
  const tableMap: Record<string, any> = {
    classes: mockData.classes,
    class_instances: mockData.classInstances,
    bookings: mockData.bookings,
    memberships: mockData.memberships,
    membership_types: mockData.membershipTypes,
    workshops: mockData.workshops,
    products: mockData.products,
    locations: mockData.locations,
    rooms: mockData.rooms,
    instructors: mockData.instructors,
    staff: mockData.instructors,
    clients: mockData.clients,
    users: mockData.clients,
    profiles: [{ id: "mock-admin-user-001", role: "admin", full_name: "Demo Admin" }],
    notifications: mockData.notifications,
    reviews: mockData.reviews,
    achievements: mockData.achievements,
    class_recordings: [],
    workshop_registrations: [],
  }

  return tableMap[table] || []
}
