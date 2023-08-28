import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '315'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '696'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a16'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '7c9'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'c70'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '67e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'e13'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '741'),
    routes: [
      {
        path: '/docs/Architecture',
        component: ComponentCreator('/docs/Architecture', '105'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Base de données',
        component: ComponentCreator('/docs/Base de données', '30c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Contexte',
        component: ComponentCreator('/docs/Contexte', '764'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Documentation Swagger',
        component: ComponentCreator('/docs/Documentation Swagger', '24e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Features',
        component: ComponentCreator('/docs/Features', 'f16'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Manuel d\'installation',
        component: ComponentCreator('/docs/Manuel d\'installation', 'be7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Manuel d\'utilisation',
        component: ComponentCreator('/docs/Manuel d\'utilisation', '49b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Méthodologie',
        component: ComponentCreator('/docs/Méthodologie', '472'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Pain points',
        component: ComponentCreator('/docs/Pain points', 'a4f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Persona',
        component: ComponentCreator('/docs/Persona', 'eda'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Stack technique',
        component: ComponentCreator('/docs/Stack technique', 'f97'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Structure du projet',
        component: ComponentCreator('/docs/Structure du projet', '881'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Tests',
        component: ComponentCreator('/docs/Tests', '6e6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/User Journey',
        component: ComponentCreator('/docs/User Journey', 'ade'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '35c'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
