export interface Student {
  id?: string
  name: string
  bio: string
  age: number
  gender: string
  semester: number
  cgpa: number;
  college: string
  roll_no: string
  email: string
  branch: string
  batch_year: number
  phone: string
  skills: string[]
  portfolio_link: string
  linkedin_link: string
}

export interface Alumni {
  id?: string
  name: string
  bio: string
  roll_no: string
  age: number
  gender: string
  email: string
  current_company: string
  current_position: string
  batch_year: number
  cgpa: number
  college: string
  skills: string[]
  portfolio_link: string
  linkedin_link: string
  branch: string
  phone: string
}

export interface Admin {
  id?: string
  name: string
  email: string
  password: string
  college: string
}
