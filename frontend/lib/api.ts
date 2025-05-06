// User API
export async function fetchUser() {
  const res = await fetch('http://localhost:8080/api/users');
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchUserById(id: string) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchUserByUsername(username: string) {
  const res = await fetch(`http://localhost:8080/api/users/username/${username}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchUserByEmail(email: string) {
  const res = await fetch(`http://localhost:8080/api/users/email/${email}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function createUser(user: any) {
  const res = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function updateUser(id: string, user: any) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

// export async function uploadAvatar(id: string, avatar: any) {
//   const res = await fetch(`http://localhost:8080/api/users/${id}/avatar`, {
//     method: 'POST',
//     body: avatar
//   });
//   if (!res.ok) throw new Error('Network request failed');
//   return res.json();
// }

export async function uploadUserAvatar(id: string, avatarFile: File) {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const res = await fetch(`http://localhost:8080/api/users/${id}/avatar`, {
    method: 'POST',
    body: formData,
    // Note: 'Content-Type': 'multipart/form-data' is usually set automatically by browsers when using FormData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Avatar upload failed and could not parse error response' }));
    console.error('Avatar upload error response:', errorData);
    throw new Error(errorData.message || 'Avatar upload failed');
  }
  return res.json(); // Expects backend to return the updated User object with new avatar Base64
}

// TrainingData API
export async function fetchTrainingData() {
  const res = await fetch('http://localhost:8080/api/training-data');
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchTrainingDataById(id: string) {
  const res = await fetch(`http://localhost:8080/api/training-data/${id}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchTrainingDataByUserId(userId: string) {
  const res = await fetch(`http://localhost:8080/api/training-data/user/${userId}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchTrainingDataByUserSession(userId: string, start: string, end: string) {
  const res = await fetch(`http://localhost:8080/api/training-data/user/${userId}/session?start=${start}&end=${end}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchTrainingDataByUserRange(userId: string, from: string, to: string) {
  const res = await fetch(`http://localhost:8080/api/training-data/user/${userId}/range?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function createTrainingData(data: any) {
  const res = await fetch('http://localhost:8080/api/training-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function updateTrainingData(id: string, data: any) {
  const res = await fetch(`http://localhost:8080/api/training-data/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function deleteTrainingData(id: string) {
  const res = await fetch(`http://localhost:8080/api/training-data/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

// Recommendation API
export async function fetchRecommendation() {
  const res = await fetch('http://localhost:8080/api/recommendations');
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchRecommendationById(id: string) {
  const res = await fetch(`http://localhost:8080/api/recommendations/${id}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchRecommendationByUserId(userId: string) {
  const res = await fetch(`http://localhost:8080/api/recommendations/user/${userId}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchRecommendationByUserType(userId: string, type: string) {
  const res = await fetch(`http://localhost:8080/api/recommendations/user/${userId}/type/${type}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchRecommendationByUserRange(userId: string, from: string, to: string) {
  const res = await fetch(`http://localhost:8080/api/recommendations/user/${userId}/range?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function createRecommendation(recommendation: any) {
  const res = await fetch('http://localhost:8080/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recommendation)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function updateRecommendation(id: string, recommendation: any) {
  const res = await fetch(`http://localhost:8080/api/recommendations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recommendation)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function deleteRecommendation(id: string) {
  const res = await fetch(`http://localhost:8080/api/recommendations/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

// Activity API
export async function fetchActivity() {
  const res = await fetch('http://localhost:8080/api/activities');
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchActivityById(id: string) {
  const res = await fetch(`http://localhost:8080/api/activities/${id}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchActivityByUserId(userId: string) {
  const res = await fetch(`http://localhost:8080/api/activities/user/${userId}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchActivityByUserAndRange(userId: string, from: string, to: string) {
  const res = await fetch(`http://localhost:8080/api/activities/user/${userId}/range?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function fetchActivityByUserAndType(userId: string, type: string) {
  const res = await fetch(`http://localhost:8080/api/activities/user/${userId}/type/${type}`);
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function createActivity(activity: any) {
  const res = await fetch('http://localhost:8080/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function updateActivity(id: string, activity: any) {
  const res = await fetch(`http://localhost:8080/api/activities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity)
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}

export async function deleteActivity(id: string) {
  const res = await fetch(`http://localhost:8080/api/activities/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Network request failed');
  return res.json();
}


