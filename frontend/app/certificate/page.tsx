"use client"

import React, { useState, useRef } from "react"
import { Award, Download, Share2, ChevronLeft } from "lucide-react"
import html2canvas from "html2canvas"

export default function CertificatePage() {
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) setSubmitted(true)
  }

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false
      })
      const link = document.createElement('a')
      link.download = `${name.replace(/\s+/g, '_')}_SkillAssign_Certificate.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    }
  }

  const shareOnLinkedIn = async () => {
    if (certificateRef.current) {
      try {
        // Generate certificate image
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: false,
          logging: false
        })
        
        // Download the image first
        const link = document.createElement('a')
        link.download = `${name.replace(/\s+/g, '_')}_Certificate.png`
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
        
        // Then open LinkedIn with pre-filled text
        setTimeout(() => {
          const text = `🎉 Excited to share that I've completed the Skill Assign Learning Program!

✅ Mastered web development fundamentals including HTML, CSS, JavaScript, Networking, and Node.js
✅ Built practical coding skills through hands-on projects
✅ Ready to tackle new development challenges

Thanks to Skill Assign for providing such an excellent learning experience!

#WebDevelopment #SkillAssign #LearningJourney #TechSkills #Certification #HTML #CSS #JavaScript #Networking #NodeJS`
          
          const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
          window.open(linkedInUrl, '_blank')
          
          alert('Certificate downloaded! Please upload the downloaded image to your LinkedIn post.')
        }, 1000)
        
      } catch (error) {
        console.error('Error generating certificate:', error)
        alert('Error generating certificate. Please try downloading it manually.')
      }
    }
  }

  if (!submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Generate Certificate</h1>
            <p className="text-gray-600">Enter your name to create your completion certificate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Generate Certificate
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSubmitted(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={downloadCertificate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share on LinkedIn
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="flex justify-center">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div 
              ref={certificateRef}
              className="bg-white"
              style={{ width: '842px', height: '595px' }} // A4 landscape dimensions
            >
              {/* Certificate Content */}
              <div className="h-full flex flex-col relative p-10">
                {/* Decorative Borders */}
                <div className="absolute inset-3 border-2 border-gray-700 rounded"></div>
                <div className="absolute inset-5 border border-gray-400 rounded"></div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-800 tracking-wider">SKILL ASSIGN</div>
                      <div className="text-xs text-gray-500 tracking-widest uppercase">Learning Platform</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center text-center relative z-10 space-y-5">
                  <div>
                    <h1 className="text-2xl font-light text-gray-700 mb-2 tracking-wider uppercase">Certificate of Achievement</h1>
                    <div className="w-28 h-px bg-gray-500 mx-auto"></div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg text-gray-600">This certificate is proudly presented to</p>
                    <div>
                      <div className="text-3xl font-medium text-gray-800 tracking-wide mb-1 py-1">
                        {name}
                      </div>
                      <div className="w-56 h-px bg-gray-400 mx-auto"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-lg text-gray-600">for successfully completing the course</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-md py-3 px-5 mx-10">
                      <div className="text-xl font-semibold text-gray-700 mb-1">Frontend Web Development</div>
                      <p className="text-sm text-gray-500">A comprehensive program covering HTML, CSS, JavaScript, and Networking</p>
                    </div>
                  </div>

                  {/* Skills Icons */}
                  {/* <div className="flex justify-center gap-4 pt-2">
                    <div className="text-center">
                      <div className="w-11 h-11 border border-orange-500 rounded flex items-center justify-center bg-orange-50">
                        <span className="text-orange-600 font-semibold text-xs">HTML</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5 block">HTML5</span>
                    </div>
                    <div className="text-center">
                      <div className="w-11 h-11 border border-blue-500 rounded flex items-center justify-center bg-blue-50">
                        <span className="text-blue-600 font-semibold text-xs">CSS</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5 block">CSS3</span>
                    </div>
                    <div className="text-center">
                      <div className="w-11 h-11 border border-yellow-500 rounded flex items-center justify-center bg-yellow-50">
                        <span className="text-yellow-600 font-semibold text-xs">JS</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5 block">JavaScript</span>
                    </div>
                    <div className="text-center">
                      <div className="w-11 h-11 border border-green-500 rounded flex items-center justify-center bg-green-50">
                        <span className="text-green-600 font-semibold text-xs">NET</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5 block">Networking</span>
                    </div>
                  </div> */}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end relative z-10 mt-auto pt-4">
                    {/* Left Column: Presented By */}
                    <div className="flex flex-col items-start">
                        <div className="w-20 h-px bg-gray-400 mb-1.5"></div>
                        <div className="text-xs text-gray-500">Presented by</div>
                        <div className="text-sm font-medium text-gray-700">Skill Assign Team</div>
                    </div>

                    {/* Center Column: Seal/Award */}
                    <div className="flex flex-col items-center justify-end">
                       <div className="w-10 h-10 border-2 border-gray-600 rounded-full flex items-center justify-center">
                         <Award className="w-5 h-5 text-gray-600" />
                       </div>
                    </div>
                  
                    {/* Right Column: Date Issued */}
                    <div className="flex flex-col items-end">
                        <div className="w-20 h-px bg-gray-400 mb-1.5"></div>
                        <div className="text-xs text-gray-500">Date Issued</div>
                        <div className="text-sm font-medium text-gray-700">
                          {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                    </div>
                </div>

                {/* Unofficial Certificate Watermark */}
                <div className="text-center relative z-0">
                  <span className="text-xs text-gray-300 select-none opacity-50 ml-2">Unofficial Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
