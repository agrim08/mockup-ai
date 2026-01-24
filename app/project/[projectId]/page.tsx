'use client'
import { useEffect, useState } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import ProjectSettings from './_shared/ProjectSettings'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { ProjectType, ScreenConfigType } from '@/types/types'
import Loading from '@/components/custom/Loading'
import Canvas from '@/_shared/Canvas'

const ProjectCanvasPlayground = () => {
  const [projectDetail, setProjectDetail] = useState<ProjectType>()
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [screenConfigOriginal, setScreenConfigOriginal] = useState<ScreenConfigType[]>([])
  const [screenConfig, setScreenConfig] = useState<ScreenConfigType[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const {projectId} = useParams()

  useEffect(() => { 
      projectId && getProjectDetail()
  }, [projectId])

  const getProjectDetail = async() => {
      setLoadingMsg('Loading Project Detail')
      setLoading(true)
      const res = await axios.get('/api/project?projectId=' + projectId)
      console.log(res?.data)
      setProjectDetail(res?.data.projectDetails)
      setScreenConfigOriginal(res?.data.screenConfig)
      setScreenConfig(res?.data.screenConfig)

      setLoading(false)
  }

  useEffect(() => {
    if(projectDetail && screenConfigOriginal && screenConfigOriginal.length === 0){
      createScreenConfig()
    }
    else if(projectDetail && screenConfigOriginal && screenConfigOriginal.length > 0 && !isGenerating){
      const hasMissingCode = screenConfigOriginal.some(screen => !screen.code);
      if (hasMissingCode) {
        GenerateScreenUI()
      }
    }
  }, [projectDetail, screenConfigOriginal, isGenerating])

  const createScreenConfig = async() => {
      setLoadingMsg('Creating Screens...')
      setLoading(true)
      const res = await axios.post('/api/generate-config', {
        projectId: projectId as string,
        userInput: projectDetail?.userInput,
        device: projectDetail?.device,
      })
      console.log(res?.data)
      getProjectDetail()
  }

  const GenerateScreenUI = async() => {
    setIsGenerating(true)
    setLoading(true)
    
    for(let index = 0; index < screenConfig?.length; index++){
      const screen = screenConfig[index]
      if(screen?.code) continue;
      
      setLoadingMsg(`Generating Screen ${index + 1}`)

      try {
        const res = await axios.post('/api/generate-screen-ui', {
          projectId: projectId as string,
          screenId: screen?.screenId,
          screenName: screen?.screenName,
          purpose: screen?.purpose,
          screenDescription: screen?.screenDescription,
        })
        console.log("Generated Screen Data:", res?.data)
        
        // Update local state immediately so user sees progress
        setScreenConfig((prev) => 
          prev.map((item) => (item.id === res.data.id ? res.data : item))
        )
      } catch (error) {
        console.error("Error generating screen UI:", error)
      }
    }
    
    setIsGenerating(false)
    setLoading(false)
  }

  return (
    <div className='pt-15'>
        <ProjectHeader />
        <div className="flex">
          <Loading loading={loading} message={loadingMsg} />
          <ProjectSettings projectDetail={projectDetail}/>
          <Canvas projectDetail={projectDetail} screenConfig={screenConfig} loading={loading}/>
        </div>
    </div>
  )
}

export default ProjectCanvasPlayground