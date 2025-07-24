"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, LogIn, Database, CheckCircle } from "lucide-react"

export default function TestLoginPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [testEmail, setTestEmail] = useState("joao@test.com")
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
    checkCurrentUser()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/test-login')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentUser = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }

  const loginAsUser = async (email: string) => {
    try {
      const response = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem('user', JSON.stringify(userData))
        setCurrentUser(userData)
        alert(`Logged in as ${userData.name}`)
      } else {
        const error = await response.json()
        alert(`Login failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null)
    alert('Logged out successfully')
  }

  const testProfileAPI = async () => {
    if (!currentUser) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch(`/api/user/${currentUser.id}/profile`)
      if (response.ok) {
        const profile = await response.json()
        console.log('Profile data:', profile)
        alert('Profile API working! Check console for details.')
      } else {
        const error = await response.json()
        alert(`Profile API failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Profile API error:', error)
      alert('Profile API failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Login & Debug</h1>
          <p className="text-gray-600">Use this page to test user authentication and debug profile issues</p>
        </div>

        {/* Current User Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current User Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                  <Badge variant={currentUser.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {currentUser.role}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={testProfileAPI} variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Profile API
                  </Button>
                  <Button onClick={logout} variant="outline">
                    Logout
                  </Button>
                  <Button onClick={() => router.push('/dashboard')} className="bg-green-600 hover:bg-green-700">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No user logged in</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Login */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Quick Login
            </CardTitle>
            <CardDescription>Login with a test email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button onClick={() => loginAsUser(testEmail)} className="bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Available Users
            </CardTitle>
            <CardDescription>Users in the database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Button 
                        onClick={() => loginAsUser(user.email)} 
                        size="sm"
                        variant="outline"
                      >
                        Login as this user
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
