"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Upload } from "lucide-react"
import { fetchUserById, updateUser, uploadUserAvatar } from "@/lib/api"

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    fullName: "",
    email: "",
    avatar: "",
    age: "",
    height: "",
    weight: "",
    position: "",
    skillLevel: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("/placeholder.svg")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const { id } = JSON.parse(storedUser)
      if (id) {
        fetchUserById(id)
          .then(user => {
            setFormData({
              id: user.id || "",
              username: user.username || "",
              fullName: user.fullName || "",
              email: user.email || "",
              avatar: user.avatar || "",
              age: user.age?.toString() || "",
              height: user.height?.toString() || "",
              weight: user.weight?.toString() || "",
              position: user.position || "",
              skillLevel: user.skillLevel || "",
            })
            if (user.avatar) {
              setAvatarPreview(`data:image/png;base64,${user.avatar}`)
            } else {
              setAvatarPreview("/placeholder.svg")
            }
          })
          .catch(console.error)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id) {
      alert("User ID is missing. Cannot update profile.")
      return
    }

    let currentAvatarBase64 = formData.avatar;

    try {
      if (selectedFile) {
        const updatedUserFromAvatar = await uploadUserAvatar(formData.id, selectedFile)
        currentAvatarBase64 = updatedUserFromAvatar.avatar;
        setFormData(prev => ({...prev, avatar: currentAvatarBase64 }));
        if (currentAvatarBase64) {
           setAvatarPreview(`data:image/png;base64,${currentAvatarBase64}`);
        } else {
           setAvatarPreview("/placeholder.svg");
        }
        setSelectedFile(null);
      }

      const profileDataToUpdate = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        position: formData.position,
        skillLevel: formData.skillLevel,
        avatar: currentAvatarBase64,
      };

      const updatedUser = await updateUser(formData.id, profileDataToUpdate);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      router.push("/profile");

    } catch (error: any) {
      console.error("Failed to update profile or upload avatar:", error);
      alert(`Error: ${error.message || "Could not update profile."}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details and personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2 items-center sm:items-start sm:flex-row sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={formData.fullName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">Upload a new profile picture. JPEG or PNG, max 2MB.</p>
                <div className="flex items-center space-x-2">
                  <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} id="avatarFile" className="hidden" />
                  <label htmlFor="avatarFile" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Field Position</Label>
                <Select value={formData.position} onValueChange={(value) => handleSelectChange("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="Defender">Defender</SelectItem>
                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={formData.skillLevel} onValueChange={(value) => handleSelectChange("skillLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
