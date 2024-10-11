'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Resizable } from 're-resizable'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { Loader2 } from 'lucide-react'

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false, loading: () => <Loader2 className="animate-spin" /> }
)

const initialCode = `
import React from 'react';
import { Box, Cloud, Shield, BarChart, Rocket, Server } from 'lucide-react';

const ServiceCard = ({ icon, title, features }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
    <div className="text-blue-500 mb-2">{icon}</div>
    <h2 className="text-lg font-semibold mb-2 text-center">{title}</h2>
    <ul className="text-sm text-left w-full">
      {features.map((feature, index) => (
        <li key={index} className="mb-1 flex items-start">
          <span className="text-blue-500 mr-2">•</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const AWSSlideDeck = () => {
  const services = [
    {
      icon: <Box size={28} />,
      title: "AWS EKS",
      features: [
        "Fully managed Kubernetes service",
        "Seamless integration with AWS services",
        "Support for containerized applications"
      ]
    },
    {
      icon: <Cloud size={28} />,
      title: "Auto Scaling",
      features: [
        "EKS managed node groups",
        "Kubernetes Cluster Autoscaler",
        "Horizontal Pod Autoscaler"
      ]
    },
    {
      icon: <Shield size={28} />,
      title: "Security",
      features: [
        "IAM integration for RBAC",
        "VPC network isolation",
        "AWS Secrets Manager integration"
      ]
    },
    {
      icon: <BarChart size={28} />,
      title: "Observability",
      features: [
        "Amazon CloudWatch for monitoring",
        "AWS X-Ray for tracing",
        "Container Insights for detailed metrics"
      ]
    },
    {
      icon: <Rocket size={28} />,
      title: "Deployments",
      features: [
        "Rolling updates and canary deployments",
        "Integration with AWS CodePipeline",
        "Blue/Green deployments support"
      ]
    },
    {
      icon: <Server size={28} />,
      title: "Additional Services",
      features: [
        "Amazon ECR for container images",
        "Elastic Load Balancing integration",
        "AWS Fargate for serverless containers"
      ]
    }
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Running Containers on AWS EKS</h1>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default AWSSlideDeck;
`;

export function CodePreviewComponent() {
  const [code, setCode] = useState(initialCode)
  const [compiledCode, setCompiledCode] = useState('')

  useEffect(() => {
    // Add necessary imports and setup
    const setupCode = `
      import React from 'react';
      ${code}
      render(<App />);
    `
    setCompiledCode(setupCode)
  }, [code])

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Resizable
        defaultSize={{ width: '50%', height: '100%' }}
        minWidth="30%"
        maxWidth="70%"
      >
        <div className="h-full overflow-hidden">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
      </Resizable>
      <div className="flex-1 p-4 overflow-auto">
        <LiveProvider code={compiledCode}>
          <LivePreview />
          <LiveError />
        </LiveProvider>
      </div>
    </div>
  )
}