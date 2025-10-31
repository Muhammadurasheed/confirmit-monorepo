import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Database, 
  Cloud, 
  Lock, 
  Zap, 
  Blocks,
  Network,
  Cpu
} from "lucide-react";

const techStack = [
  {
    name: "Google Gemini AI",
    description: "Advanced multi-modal AI for receipt analysis and fraud detection",
    icon: Brain,
    category: "AI/ML"
  },
  {
    name: "Hedera Hashgraph",
    description: "Enterprise-grade blockchain for immutable verification records",
    icon: Network,
    category: "Blockchain"
  },
  {
    name: "Firebase",
    description: "Real-time database and authentication infrastructure",
    icon: Database,
    category: "Backend"
  },
  {
    name: "Cloudinary",
    description: "Secure cloud storage and image processing",
    icon: Cloud,
    category: "Storage"
  },
  {
    name: "React + TypeScript",
    description: "Modern, type-safe frontend framework",
    icon: Cpu,
    category: "Frontend"
  },
  {
    name: "NestJS",
    description: "Scalable Node.js backend framework",
    icon: Blocks,
    category: "Backend"
  },
  {
    name: "FastAPI",
    description: "High-performance Python API for AI services",
    icon: Zap,
    category: "AI Services"
  },
  {
    name: "End-to-End Encryption",
    description: "Bank-grade security for all sensitive data",
    icon: Lock,
    category: "Security"
  }
];

export const TechStackCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {techStack.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="shadow-elegant hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{tech.name}</h3>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {tech.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};
