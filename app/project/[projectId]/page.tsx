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
      setScreenConfig(res?.data.screenConfig)

      setLoading(false)
  }

  useEffect(() => {
    if(projectDetail && screenConfig && screenConfig.length === 0){
      createScreenConfig()
    }
    else if(projectDetail && screenConfig && screenConfig.length > 0 && !isGenerating){
      const hasMissingCode = screenConfig.some(screen => !screen.code);
      if (hasMissingCode) {
        GenerateScreenUI()
      }
    }
  }, [projectDetail, screenConfig, isGenerating])

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
        console.log(res?.data)
        // Instead of immediate state update which triggers effect, 
        // we can update it at once or just rely on the next fetch
      } catch (error) {
        console.error("Error generating screen UI:", error)
      }
    }
    
    // Refresh the whole project to get all generated code
    await getProjectDetail()
    setIsGenerating(false)
    setLoading(false)
  }

  return (
    <div className='pt-15'>
        <ProjectHeader />
        <div className="flex">
          <Loading loading={loading} message={loadingMsg} />
          <ProjectSettings projectDetail={projectDetail}/>
          <Canvas/>
        </div>
    </div>
  )
}

export default ProjectCanvasPlayground