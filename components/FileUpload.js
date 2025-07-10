'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, FileText, Image, Upload } from 'lucide-react'

export default function FileUpload({ onUpload, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      onUpload({
        fileName: file.name,
        fileType: file.type,
        extractedText: data.extractedText,
        fileUrl: data.fileUrl
      })
      
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }, [onUpload, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {!isProcessing ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-slate-500 bg-slate-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            
            {isDragActive ? (
              <p className="text-slate-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop a document here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, images, Word docs, and text files (max 10MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">Processing document...</p>
            <p className="text-sm text-gray-500">Extracting text and analyzing content</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <h4 className="font-medium mb-2">Supported file types:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
              <FileText size={14} className="mr-1" />
              PDF
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
              <Image size={14} className="mr-1" />
              Images
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
              <FileText size={14} className="mr-1" />
              Word
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
              <FileText size={14} className="mr-1" />
              Text
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
