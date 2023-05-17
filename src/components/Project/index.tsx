import {
  Project as ProjectWrapper,
  ProjectTitle,
  ProjectStack,
  ProjectStackTech,
  ProjectLink,
  ProjectLinks,
} from "./style";

import { Text } from "@/styles/Text";
import { useEffect, useState } from "react";
import { FaGithub, FaShare } from "react-icons/fa";
import { userData } from "@/utils/userData";

interface ReposType {
  id: number;
  name: string;
  language: string;
  description: string;
  html_url: string;
  homepage: string;
}

export const Project = (): JSX.Element => {
  const [repositories, setRepositories] = useState<ReposType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `https://api.github.com/users/${userData.githubUser}/repos?sort=created&direction=desc`
      );

      const json = await data.json();
      async function getLanguages(
        userData: {
          nameUser?: string;
          githubUser: any;
          linkedinUser?: string;
          whatsappNumber?: string;
          emailUser?: string;
          instagramUser?: string;
          facebookUser?: string;
        },
        json: { name: any; language: string[] }[]
      ) {
        const languages = await Promise.all(
          json.map(async (project: { name: any; language: string[] }) => {
            const response = await fetch(
              `https://api.github.com/repos/${userData.githubUser}/${project.name}/languages`
            );

            const data = await response.json();

            project.language = Object.keys(data);
          })
        );

        return languages;
      }

      await getLanguages(userData, json);

      setRepositories(json);

      return json;
    };

    fetchData();
  }, []);

  return (
    <>
      {repositories &&
        repositories?.map?.((repository: any) => (
          <ProjectWrapper key={repository.id}>
            <ProjectTitle
              as="h2"
              type="heading3"
              css={{ marginBottom: "$3" }}
              color="grey4"
            >
              {repository.name}
            </ProjectTitle>

            <ProjectStack>
              <Text type="body2" color="grey2">
                Linguagens utilizadas:
              </Text>
              {repository.language.map((e: string) => (
                <ProjectStackTech key={Math.random()}>
                  <Text color="grey2" type="body2">
                    {e}
                  </Text>
                </ProjectStackTech>
              ))}
            </ProjectStack>

            <Text type="body1" color="grey2">
              {repository.description?.substring(0, 129)}
            </Text>
            <ProjectLinks>
              <ProjectLink target="_blank" href={repository.html_url}>
                <FaGithub /> Código no Github
              </ProjectLink>
              {repository.homepage && (
                <ProjectLink target="_blank" href={`${repository.homepage}`}>
                  <FaShare /> Ver demonstração
                </ProjectLink>
              )}
            </ProjectLinks>
          </ProjectWrapper>
        ))}
    </>
  );
};
