import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scan, ShoppingCart, Book, Refrigerator } from 'lucide-react';

const ColorPalette: React.FC<{ name: string; color: string; textColor?: string }> = ({
  name,
  color,
  textColor = 'text-white'
}) => (
  <div className="flex flex-col">
    <div
      className={`w-full h-16 rounded-md mb-1 ${textColor} flex items-center justify-center font-medium`}
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
    <span className="text-xs font-mono">{color}</span>
  </div>
);

const StyleGuidePage: React.FC = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="container py-8 px-4 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="font-heading font-bold text-4xl mb-2">ScanCook Style Guide</h1>
          <p className="text-muted">Charte graphique et guide de style pour l'application ScanCook</p>
        </header>

        <Tabs defaultValue="colors" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Couleurs</TabsTrigger>
            <TabsTrigger value="typography">Typographie</TabsTrigger>
            <TabsTrigger value="components">Composants</TabsTrigger>
            <TabsTrigger value="icons">Icônes</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Palette de couleurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Couleurs principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPalette name="Primaire" color="#FF6B35" />
                    <ColorPalette name="Secondaire" color="#2EC4B6" />
                    <ColorPalette name="Accent" color="#4D21FC" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Nuances primaires</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ColorPalette name="Primaire claire" color="#FF8A5C" />
                    <ColorPalette name="Primaire" color="#FF6B35" />
                    <ColorPalette name="Primaire foncée" color="#E54E17" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Nuances secondaires</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ColorPalette name="Secondaire claire" color="#48E5D7" />
                    <ColorPalette name="Secondaire" color="#2EC4B6" />
                    <ColorPalette name="Secondaire foncée" color="#21A396" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Nuances accent</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ColorPalette name="Accent claire" color="#7151FD" />
                    <ColorPalette name="Accent" color="#4D21FC" />
                    <ColorPalette name="Accent foncée" color="#3B0FE2" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Neutres</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <ColorPalette name="100" color="#FFFFFF" textColor="text-neutral-900" />
                    <ColorPalette name="200" color="#F5F7FA" textColor="text-neutral-900" />
                    <ColorPalette name="300" color="#E4E7EF" textColor="text-neutral-900" />
                    <ColorPalette name="400" color="#CBD1E0" textColor="text-neutral-900" />
                    <ColorPalette name="500" color="#9AA1B9" textColor="text-neutral-900" />
                    <ColorPalette name="600" color="#5B5F7B" />
                    <ColorPalette name="700" color="#4A4D63" />
                    <ColorPalette name="800" color="#383A4C" />
                    <ColorPalette name="900" color="#333333" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Couleurs fonctionnelles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorPalette name="Succès" color="#06D6A0" />
                    <ColorPalette name="Erreur" color="#EF476F" />
                    <ColorPalette name="Avertissement" color="#FFD166" textColor="text-neutral-900" />
                    <ColorPalette name="Information" color="#118AB2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Typographie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Police principale - Poppins</h3>
                  <div className="space-y-4 mb-6">
                    <p className="font-sans text-sm font-light">Poppins Light (300) - Texte très léger et discret</p>
                    <p className="font-sans text-sm">Poppins Regular (400) - Texte standard pour le contenu</p>
                    <p className="font-sans text-sm font-medium">Poppins Medium (500) - Mise en évidence légère</p>
                    <p className="font-sans text-sm font-semibold">Poppins Semi-Bold (600) - Sous-titres, labels importants</p>
                    <p className="font-sans text-sm font-bold">Poppins Bold (700) - Accentuation forte</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Police secondaire - Montserrat</h3>
                  <div className="space-y-4 mb-6">
                    <p className="font-heading text-base">Montserrat Regular (400) - Sous-titres mineurs</p>
                    <p className="font-heading text-base font-medium">Montserrat Medium (500) - Titres secondaires</p>
                    <p className="font-heading text-base font-semibold">Montserrat Semi-Bold (600) - Titres importants</p>
                    <p className="font-heading text-base font-bold">Montserrat Bold (700) - Grands titres, éléments majeurs</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Hiérarchie des titres</h3>
                  <div className="space-y-4">
                    <div>
                      <h1>Titre h1</h1>
                      <p className="text-xs text-muted">font-heading, text-3xl md:text-4xl, font-bold</p>
                    </div>
                    <div>
                      <h2>Titre h2</h2>
                      <p className="text-xs text-muted">font-heading, text-2xl md:text-3xl, font-semibold</p>
                    </div>
                    <div>
                      <h3>Titre h3</h3>
                      <p className="text-xs text-muted">font-heading, text-xl md:text-2xl, font-semibold</p>
                    </div>
                    <div>
                      <h4>Titre h4</h4>
                      <p className="text-xs text-muted">font-heading, text-lg md:text-xl, font-medium</p>
                    </div>
                    <div>
                      <h5>Titre h5</h5>
                      <p className="text-xs text-muted">font-heading, text-base md:text-lg, font-medium</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Corps de texte</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-base">Texte standard (16px)</p>
                      <p className="text-xs text-muted">font-sans, text-base, font-normal</p>
                    </div>
                    <div>
                      <p className="text-sm">Texte secondaire (14px)</p>
                      <p className="text-xs text-muted">font-sans, text-sm, font-normal</p>
                    </div>
                    <div>
                      <p className="text-xs">Légendes, notes (12px)</p>
                      <p className="text-xs text-muted">font-sans, text-xs, font-normal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>Éléments d'interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Boutons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Button variant="default">Bouton primaire</Button>
                      <p className="text-xs text-muted">variant="default"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="secondary">Bouton secondaire</Button>
                      <p className="text-xs text-muted">variant="secondary"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline">Bouton outline</Button>
                      <p className="text-xs text-muted">variant="outline"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="ghost">Bouton ghost</Button>
                      <p className="text-xs text-muted">variant="ghost"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="link">Bouton lien</Button>
                      <p className="text-xs text-muted">variant="link"</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="default" disabled>Bouton désactivé</Button>
                      <p className="text-xs text-muted">disabled</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Badge par défaut</Badge>
                    <Badge variant="secondary">Badge secondaire</Badge>
                    <Badge variant="outline">Badge outline</Badge>
                    <Badge variant="destructive">Badge destructif</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Alertes</h3>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>
                        Une alerte d'information standard pour notifier l'utilisateur.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle>Erreur</AlertTitle>
                      <AlertDescription>
                        Une alerte d'erreur pour signaler un problème critique.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Champs de formulaire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" placeholder="entrez votre email" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="disabled">Champ désactivé</Label>
                      <Input type="text" id="disabled" disabled value="Non modifiable" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        J'accepte les conditions
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Cartes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Carte basique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Contenu de la carte avec des informations essentielles.</p>
                      </CardContent>
                    </Card>
                    
                    <div className="card-container">
                      <h4 className="text-lg font-medium mb-2">Carte personnalisée</h4>
                      <p>Utilisant la classe utilitaire .card-container</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icons">
            <Card>
              <CardHeader>
                <CardTitle>Iconographie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Style d'icônes</h3>
                  <p className="mb-4">ScanCook utilise des icônes de style "ligne" (outline) de la bibliothèque Lucide React.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Icônes principales</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <Scan className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm">Scanner</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <Refrigerator className="h-8 w-8 text-secondary" />
                      </div>
                      <span className="text-sm">Réfrigérateur</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <Book className="h-8 w-8 text-accent" />
                      </div>
                      <span className="text-sm">Recettes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <ShoppingCart className="h-8 w-8 text-muted" />
                      </div>
                      <span className="text-sm">Panier</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Tailles d'icônes</h3>
                  <div className="flex items-end space-x-6">
                    <div className="flex flex-col items-center">
                      <Scan className="h-4 w-4 mb-1" />
                      <span className="text-xs">xs (16px)</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scan className="h-5 w-5 mb-1" />
                      <span className="text-xs">sm (20px)</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scan className="h-6 w-6 mb-1" />
                      <span className="text-xs">md (24px)</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scan className="h-8 w-8 mb-1" />
                      <span className="text-xs">lg (32px)</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scan className="h-10 w-10 mb-1" />
                      <span className="text-xs">xl (40px)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations">
            <Card>
              <CardHeader>
                <CardTitle>Animations et transitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Principes d'animation</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Les animations doivent être subtiles et servir à améliorer l'expérience utilisateur.</li>
                    <li>Les transitions doivent être fluides et ne pas ralentir l'utilisation de l'application.</li>
                    <li>Utilisez des animations courtes (150-300ms) pour les interactions directes.</li>
                    <li>Préférez les courbes d'accélération naturelles (ease-in-out).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Animations prédéfinies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <div className="animate-fade-in p-4 bg-primary/10 rounded-md text-center mb-2">
                        Cet élément utilise animate-fade-in
                      </div>
                      <code className="text-xs mt-2">animate-fade-in</code>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <div className="animate-scale-in p-4 bg-secondary/10 rounded-md text-center mb-2">
                        Cet élément utilise animate-scale-in
                      </div>
                      <code className="text-xs mt-2">animate-scale-in</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Effets au survol</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <button className="hover-scale bg-primary text-white px-4 py-2 rounded-md">
                        Survolez-moi (scale)
                      </button>
                      <code className="text-xs mt-2">hover-scale</code>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <button className="hover-lift bg-secondary text-white px-4 py-2 rounded-md">
                        Survolez-moi (lift)
                      </button>
                      <code className="text-xs mt-2">hover-lift</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Durées de transition</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <button className="transition-fast bg-neutral-200 hover:bg-primary hover:text-white px-4 py-2 rounded-md">
                        Transition rapide (150ms)
                      </button>
                      <code className="text-xs mt-2">transition-fast</code>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <button className="transition-medium bg-neutral-200 hover:bg-secondary hover:text-white px-4 py-2 rounded-md">
                        Transition moyenne (300ms)
                      </button>
                      <code className="text-xs mt-2">transition-medium</code>
                    </div>
                    <div className="p-4 border rounded-md flex flex-col items-center">
                      <button className="transition-slow bg-neutral-200 hover:bg-accent hover:text-white px-4 py-2 rounded-md">
                        Transition lente (500ms)
                      </button>
                      <code className="text-xs mt-2">transition-slow</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="my-8">
          <h2 className="font-heading font-semibold text-2xl mb-4">Exemples d'écrans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Écran Scanner</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center bg-neutral-100 rounded-md">
                <div className="w-full aspect-[9/16] bg-white rounded-lg border-2 border-primary flex flex-col items-center justify-center relative shadow-md">
                  <div className="absolute inset-0 border-2 border-primary/10 m-4 rounded-md"></div>
                  <div className="scan-line"></div>
                  <div className="mt-auto mb-8 w-4/5">
                    <Button className="w-full">
                      <Scan className="mr-2 h-4 w-4" />
                      Scanner un produit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Écran Recettes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center bg-neutral-100 rounded-md">
                <div className="w-full aspect-[9/16] bg-white rounded-lg border-2 border-primary flex flex-col items-start justify-start relative shadow-md p-4">
                  <h3 className="font-heading font-semibold text-xl mb-2">Suggestions de recettes</h3>
                  <p className="text-sm text-muted mb-4">Basées sur 3 produits scannés</p>
                  
                  <div className="w-full space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="card-container flex p-2">
                        <div className="w-1/3 bg-neutral-200 rounded-md mr-2 aspect-square"></div>
                        <div className="w-2/3 text-left">
                          <h4 className="font-medium">Recette exemple {i}</h4>
                          <p className="text-xs text-muted">25 min · Facile</p>
                          <div className="mt-2 flex">
                            <Badge variant="outline" className="text-xs mr-1">Italien</Badge>
                            <Badge variant="outline" className="text-xs">Végan</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
};

export default StyleGuidePage;
