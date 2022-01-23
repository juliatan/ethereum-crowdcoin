import React, { FC, useEffect, useState } from 'react'
import factory from '../ethereum/factory'

const CampaignIndex: FC = () => {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await factory.methods.getDeployedCampaigns().call()
      console.log(data)
      setCampaigns(data)
    }

    try {
      fetchCampaigns()
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <h1>Campaign list page</h1>
      <p>List of campaigns</p>
      {campaigns.map((campaign) => campaign)}
    </>
  )
}

export default CampaignIndex
