import { Paragraph, ScrollView, SizableText, YStack } from '@my/ui'
import { Linking, Alert } from 'react-native'

const openEmail = (email: string) => {
  const emailWithPrefix = `mailto:${email}`
  Linking.canOpenURL(emailWithPrefix)
    .then((supported) => {
      if (!supported) {
        Alert.alert(
          'E-Mail-Client nicht gefunden',
          'Bitte konfigurieren Sie einen E-Mail-Client, um E-Mails zu senden.'
        )
      } else {
        return Linking.openURL(emailWithPrefix)
      }
    })
    .catch((err) => console.error('Error opening email link:', err))
}

const Title = ({ children }) => (
  <SizableText mb="$-4" mt="$4" size="$7">
    {children}
  </SizableText>
)

const Subtitle = ({ children }) => (
  <SizableText mb="$-3" mt="$5" size="$6">
    {children}
  </SizableText>
)
const BoldParagraph = ({ children }) => <Paragraph fontWeight="bold">{children}</Paragraph>

// Main Information Sheet Component
const PrivacyPolicyScreen = () => (
  <ScrollView>
    <YStack gap="$4" p="$4">
      {/* only show title on web since mobile has navigator title */}
      {/* {isWeb && <H1>Informationsblatt für Teilnehmende</H1>} */}
      <Title>Informationsblatt für Teilnehmende</Title>

      <Paragraph mt="$4" mb="$-4">
        Zur Studie:
      </Paragraph>
      <BoldParagraph>
        Etablierung und Einfluss von technologiegestütztem Microlearning (MiLeMed-App) in der
        Geburtshilfe
      </BoldParagraph>

      <Paragraph>Einladung zur Teilnahme</Paragraph>
      <Paragraph>Liebe Studierende,</Paragraph>
      <Paragraph>
        hiermit laden wir Sie dazu ein an dieser Lehrstudie teilzunehmen. Bevor Sie sich dazu
        entscheiden, an der Lehrstudie teilzunehmen, ist es für Sie wichtig zu verstehen, warum
        diese Studie durchgeführt wird und was sie alles beinhaltet. Bitte nehmen Sie sich Zeit die
        folgenden Informationen sorgfältig zu lesen. Falls Unklarheiten bestehen, Fragen auftreten
        oder Sie gerne mehr Informationen wünschen kontaktieren Sie uns gerne.
      </Paragraph>

      <Subtitle>Was ist der Zweck dieser Lehrstudie?</Subtitle>
      <Paragraph>
        Die Bildungslandschaft hat sich in den letzten Jahren stark gewandelt, insbesondere vor dem
        Hintergrund der globalen Covid-19-Pandemie. Die steigende Bedeutung alternativer
        Lernmethoden jenseits von traditionellen Lehrbüchern und Online-Plattformen ist an der
        Universität Bonn und deutschlandweit spürbar. Ein vielversprechender Ansatz ist das
        Microlearning, bei dem Lerninhalte in kleine, gut verdauliche Module aufgeteilt werden.
      </Paragraph>

      <Paragraph>
        Trotz der etablierten Nutzung des Microlearning in anderen Bereichen (wie zum Beispiel im
        Bereich des Sprachen-Lernens mit Duolingo und Babbel) hat dieses Konzept bisher nur
        begrenzten Einzug in die Gynäkologie, Geburtshilfe und die Medizin insgesamt gefunden. Die
        Microlearning-App soll nicht als Nachschlagewerk, sondern als ergänzendes Angebot zu den
        Lehrveranstaltungen der Geburtshilfe dienen. Sie bietet im Vergleich zu dem Lernen mit
        Karteikarten (z.B. mit Anki) die Durchführung des Konzeptes der „Spaced Repetition“ mit
        deutlich geringerem zeitlichem Aufwand.
      </Paragraph>

      <Paragraph>
        Es wird eine neue Microlearning App geschaffen, welche an die Inhalte der Vorlesung und des
        Blockpraktikums Geburtshilfe der Universität Bonn angepasst ist. Diese App wird den
        Studierenden des 6. klinischen Semesters zur Verfügung gestellt, um als ergänzendes
        Lernmaterial für die OSCE genutzt zu werden.
      </Paragraph>

      <Subtitle>Warum wurden Sie für die Studie ausgewählt?</Subtitle>
      <Paragraph>
        Sie wurden ausgewählt, weil Sie älter als 18 Jahre alt sind und Humanmedizin an der
        medizinischen Fakultät der Rheinischen-Friedrich-Wilhelms-Universität Bonn im 6. Semestern
        des klinischen Abschnitts studieren.
      </Paragraph>

      <Subtitle>Müssen Sie an der Studie teilnehmen?</Subtitle>
      <Paragraph>
        Selbstverständlich müssen Sie nicht an der Studie teilnehmen. Die Entscheidung, ob Sie
        teilnehmen oder nicht, ist Ihre eigene. Falls Sie sich dazu entscheiden sollten an der
        Lehrstudie teilzunehmen erhalten Sie hier die Informationen zur Studie. Es steht Ihnen
        jederzeit frei, ohne Angaben von Gründen zurückzutreten.
      </Paragraph>

      <Subtitle>Was geschieht mit Ihnen, wenn Sie teilnehmen?</Subtitle>
      <Paragraph>
        Wir haben eine neue Microlearning-App für das Fach Geburtshilfe entwickelt. Falls Sie sich
        entscheiden an der Studie teilzunehmen erhalten Sie Zugang zu der App und Ihren Inhalten.
        Diese können Sie das ganze Semester uneingeschränkt nutzen als zusätzliches Lernmaterial in
        Vorbereitung auf die OSCE. Die Inhalte der App sind nur ERGÄNZEND zur Veranstaltung und
        entscheiden nicht über das Bestehen.
      </Paragraph>

      <Subtitle>Was müssen Sie machen?</Subtitle>
      <Paragraph>
        Zu Beginn fragen wir in einem Fragebogen Ihre Lerngewohnheiten ab (ca. 15 Minuten).
      </Paragraph>
      <Paragraph>
        Anschließend können Sie die in der App verfügbaren Microlektionen in der von Ihnen als
        geeignet erachtete Menge durcharbeiten. Eine der ca. 120 verfügbaren Lektion nimmt dabei nur
        wenige Minuten in Anspruch und beinhaltet am Ende eine/mehrere Fragen. Die Zeitpunkte und
        Orte Ihrer Nutzung sind Ihnen dabei frei überlassen.
      </Paragraph>

      <Paragraph>
        Zum Abschluss des Semesters fragen wir in einem Fragebogen erneut Ihre Lerngewohnheiten ab
        (ca. 15 Minuten). Zudem fragen wir Ihre Zufriedenheit mit der Lehre im Fach Geburtshilfe ab
        (ca. 15 Minuten).
      </Paragraph>

      <Paragraph>
        Die Prüfung (OSCE) legen Sie wie üblich ab. Ihre Studienteilnahme ist damit beendet.
      </Paragraph>

      <Subtitle>Was ist der mögliche Nutzen?</Subtitle>
      <Paragraph>
        Durch Ihre Teilnahme an der Studie erhalten Sie Zugang zu der Microlearning-App und somit
        eine zusätzliche einfache Möglichkeit sich auf Ihre OSCE vorzubereiten. Anhand Ihres
        Feedbacks wird es zudem möglich sein, die App nach den Wünschen der Studierenden
        weiterzuentwickeln.
      </Paragraph>

      <Subtitle>Bin ich bei der Teilnahme an der Studie versichert?</Subtitle>
      <Paragraph>
        Es wird keine gesonderte Versicherung abgeschlossen, da mit keinen Risiken zu rechnen ist.
      </Paragraph>

      <Subtitle>Vertraulichkeit</Subtitle>
      <Paragraph>
        Im Rahmen der wissenschaftlichen Untersuchung werden personenbezogene Daten aufgezeichnet.
        Es wird gewährleistet, dass Ihre personenbezogenen Daten nicht an Dritte weitergegeben
        werden. Bei der Veröffentlichung in einer wissenschaftlichen Zeitung wird aus den Daten
        nicht hervorgehen, wer an dieser Untersuchung teilgenommen hat. Die Daten, die wir im
        Verlauf dieser Studie über Sie erhalten, werden strikt vertraulich behandelt. Ihre Daten
        sowie auch die Ergebnisse ihres Lernfortschrittes werden pseudonymisiert dokumentiert und
        Zugang zu diesen Daten haben ausschließlich Studienmitarbeitende. Die Vorgaben der
        Europäischen Datenschutzverordnung (DSGVO) werden eingehalten.
      </Paragraph>

      <Subtitle>Was geschieht mit den Ergebnissen der Forschungsstudie?</Subtitle>
      <Paragraph>
        Die Studienergebnisse werden veröffentlicht und helfen den Stellenwert von Microlearning für
        künftige Forschungsvorhaben zu entwickeln. Ihre Identität wird dabei selbstverständlich
        nicht bekannt gegeben.
      </Paragraph>

      <Subtitle>Kontakt für weitere Informationen</Subtitle>
      <Paragraph>
        Bitte kontaktieren Sie uns bei möglichen Unklarheiten. Sollten Sie nähere Auskünfte über
        irgendwelche Aspekte dieser Studie benötigen wenden Sie sich bitte an uns.
      </Paragraph>

      <BoldParagraph>
        Durch Nutzung der App bestätigen Sie, dass Sie mit der Datenerhebung einverstanden sind und
        an der Studie teilnehmen möchten. Weiterhin bestätigen Sie, dass Sie die angehängten
        Ausführungen nach der Europäischen Datenschutzverordnung (DSGVO) zur Kenntnis erhalten und
        zur Kenntnis genommen haben.
      </BoldParagraph>

      <BoldParagraph>
        Sie können jederzeit Ihre Einwilligung, ohne Angaben von Gründen, widerrufen, ohne dass dies
        für Sie nachteilige Folgen hat. Beim Widerruf der Einwilligung, an der Studie teilzunehmen,
        haben Sie das Recht auf die Löschung aller bis dahin gespeicherten personenbezogenen Daten.
      </BoldParagraph>
      <BoldParagraph>
        Es wird gewährleistet, dass personenbezogenen Daten nicht an Dritte weitergegeben werden.
        Bei der Veröffentlichung in einer wissenschaftlichen Zeitung wird aus den Daten nicht
        hervorgehen, wer an dieser Studie teilgenommen hat.
      </BoldParagraph>

      <Paragraph>Unsere Kontaktdaten sind wie folgt:</Paragraph>
      <Paragraph>
        PD Dr. med. Florian Recker, MME{'\n'}Abteilung für Geburtshilfe und Pränatalmedizin{'\n'}
        Universitätsklinikum Bonn{'\n'}Venusberg Campus 1{'\n'}53127 Bonn{'\n'}
        <SizableText
          onPress={() => openEmail('florian.recker@ukbonn.de')}
          color="$blue10Light"
          textDecorationLine="underline"
        >
          florian.recker@ukbonn.de
        </SizableText>
      </Paragraph>
      <Paragraph>
        Nina Michlmayr{'\n'}Studentische Hilfskraft für die Studie{'\n'}
        <SizableText
          onPress={() => openEmail('s4nimich@uni-bonn.de')}
          color="$blue10Light"
          textDecorationLine="underline"
        >
          s4nimich@uni-bonn.de
        </SizableText>
      </Paragraph>

      <Title>
        Anlage zur Einwilligungserklärung: Angaben nach der Europäischen Datenschutzverordnung
        (DSGVO)
      </Title>

      <Subtitle>1. Für die Datenverarbeitung verantwortliche Stelle:</Subtitle>
      <Paragraph>
        Abteilung für Geburtshilfe und Pränatalmedizin{'\n'}Universitätsklinikum Bonn
      </Paragraph>

      <Subtitle>2. Der zuständige Datenschutzbeauftragte:</Subtitle>
      <Paragraph>
        Achim Flender Tel.: +49 (0)228-287 16075, E-Mail: datenschutz@ukbonn.de, Venusbergcampus 1,
        Gebäude 01, 53127 Bonn
      </Paragraph>

      <Subtitle>
        3. Zweck und Rechtsgrundlage der Verarbeitung und berechtigtes Interesse des
        Verantwortlichen oder Dritter
      </Subtitle>
      <Paragraph>
        Zweck der Verarbeitung ist die Durchführung der Studie, über die Sie im erhaltenen
        Probandeninformationsblatt und mündlich aufgeklärt worden sind. Das berechtigte Interesse
        besteht im Forschungsauftrag der Universitätsklinika. Rechtsgrundlage für die
        Datenverarbeitung ist § 6 (1) (a) der DSGVO.
      </Paragraph>

      <Subtitle>4. Empfänger der personenbezogenen Daten</Subtitle>
      <Paragraph>Keine, die Daten verbleiben ausschließlich bei der erhebenden Stelle.</Paragraph>

      <Subtitle>5. Voraussichtliche Dauer der Datennutzung</Subtitle>
      <Paragraph>
        Die Studie ist für eine Gesamtdauer von voraussichtlich maximal 24 Monaten angelegt.
      </Paragraph>

      <Subtitle>6. Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde</Subtitle>
      <Paragraph>
        Sie können sich an die Landesbeauftragte für Datenschutz und Informationsfreiheit des Landes
        Nordrhein-Westfalen, Kavalleriestr. 2-4, 40213 Düsseldorf, wenden. Sie haben das Recht,
        Auskunft (einschließlich unentgeltlicher Überlassung einer Kopie) über die betreffenden
        personenbezogenen Daten zu erhalten sowie ggf. deren Berichtigung oder Löschung zu
        verlangen. Sie können die Einwilligung jeder widerrufen.
      </Paragraph>

      <Subtitle>7. Quellen Ihrer Daten</Subtitle>
      <Paragraph>
        Die Daten werden aus den von Ihnen ausgefüllten Fragebögen. Zusätzlich werden auch Ihre
        App-Nutzungsdaten ausgewertet.
      </Paragraph>

      <Subtitle>
        8. Empfangsberechtigter für alle probandenrechtlichen Anliegen der Proband*innen:
      </Subtitle>
      <Paragraph>
        PD Dr. med. Florian Recker, MME{'\n'}
        Abteilung für Geburtshilfe und Pränatalmedizin{'\n'}
        Universitätsklinikum Bonn{'\n'}
        Venusberg Campus 1{'\n'}
        53127 Bonn{'\n'}
        florian.recker@ukbonn.de{'\n'}
      </Paragraph>
    </YStack>
  </ScrollView>
)

export { PrivacyPolicyScreen }
