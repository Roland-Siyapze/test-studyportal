/**
 * @file FinancementPage.tsx
 * @description "Demande de financement" — 6-step multi-form flow + list table.
 * 
 *   Steps (matching Figma screenshots):
 *     1. Informations Personnelles
 *     2. Identité (CNI scan + parental info)
 *     3. Détails du financement
 *     4. Échéancier
 *     5. Justificatifs de demande de financement
 *     6. Marche à suivre (summary + confirmation)
 * 
 *   After submission → List view (Figma screens 9-10)
 * 
 *   Satisfies: PERM-002 (ticket:create gate for create button)
 */

import type { JSX } from 'react'
import { useState, useCallback } from 'react'
import { MOCK_FINANCEMENT_DEMANDES } from '@services/mock/financement.mock'
import type { FinancementDemande } from '@contracts/api-contracts'
import { Step1, Step2, Step3, Step4, Step5, Step6, FinancementListView } from './components'

interface EcheanceItem {
  id: string
  date: string
  somme: string
}

interface JustificatifItem {
  id: string
  nom: string
}

export interface FormData {
  prenom: string
  nom: string
  lieuNaissance: string
  dateNaissance: string
  adresseComplete: string
  pays: string
  ville: string
  quartier: string
  telephone: string
  scanPasseportName: string
  planLocalisationName: string
  scanCNIName: string
  scanCNIFile: File | null
  demiCartePhotoName: string
  demiCartePhotoFile: File | null
  nomPrenomParent1: string
  telephoneParent1: string
  lieuResidenceParent1: string
  nomPrenomParent2: string
  telephoneParent2: string
  lieuResidenceParent2: string
  serviceAFinancer: string
  coutService: string
  financementMaximal: string
  sommeDemandee: string
  fraisFinancement: string
  sommeTotaleARembourser: string
  nombreEcheances: number
  echeances: EcheanceItem[]
  justification: string
  justificatifs: JustificatifItem[]
}

const INITIAL_FORM: FormData = {
  prenom: 'Moni',
  nom: 'Roy',
  lieuNaissance: '',
  dateNaissance: '',
  adresseComplete: '',
  pays: '',
  ville: '',
  quartier: '',
  telephone: '696418984',
  scanPasseportName: '',
  planLocalisationName: '',
  scanCNIName: '',
  scanCNIFile: null,
  demiCartePhotoName: '',
  demiCartePhotoFile: null,
  nomPrenomParent1: '',
  telephoneParent1: '',
  lieuResidenceParent1: '',
  nomPrenomParent2: '',
  telephoneParent2: '',
  lieuResidenceParent2: '',
  serviceAFinancer: 'A.V.I',
  coutService: '',
  financementMaximal: '',
  sommeDemandee: '',
  fraisFinancement: '',
  sommeTotaleARembourser: '',
  nombreEcheances: 3,
  echeances: [
    { id: 'e1', date: '', somme: '' },
    { id: 'e2', date: '', somme: '' },
    { id: 'e3', date: '', somme: '' },
  ],
  justification: '',
  justificatifs: [
    { id: 'j1', nom: 'Document_1.pdf' },
    { id: 'j2', nom: 'Document_2.pdf' },
  ],
}

export function FinancementPage({ initialView = 'list' }: { initialView?: 'list' | 'form' }): JSX.Element {
  const [view, setView] = useState<'list' | 'form'>(initialView)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [demandes, setDemandes] = useState([...MOCK_FINANCEMENT_DEMANDES])

  const handleChange = useCallback((key: keyof FormData, value: string | File | null) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  function startNew(): void {
    setForm({ ...INITIAL_FORM })
    setStep(1)
    setView('form')
  }

  function handleSubmit(): void {
    const newDemande: FinancementDemande = {
      id: `fin-${Date.now()}`,
      nom: form.nom || null,
      sommeFinancement: form.sommeDemandee ? parseFloat(form.sommeDemandee) : 1000000,
      pourService: form.serviceAFinancer || null,
      dateDemande: new Date().toISOString().split('T')[0],
      sommeDejaRembourse: 0,
      sommeRestante: form.sommeTotaleARembourser ? parseFloat(form.sommeTotaleARembourser) : 0,
      documentAssocie: null,
      statut: 'EN_PREPARATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'current-user',
    }
    setDemandes(prev => [newDemande, ...prev])
    setView('list')
    setStep(1)
  }

  function renderStep(): JSX.Element {
    switch (step) {
      case 1:
        return (
          <Step1
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(2); }}
            onCancel={() => { setView('list'); }}
          />
        )
      case 2:
        return (
          <Step2
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(3); }}
            onBack={() => { setStep(1); }}
          />
        )
      case 3:
        return (
          <Step3
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(4); }}
            onBack={() => { setStep(2); }}
          />
        )
      case 4:
        return (
          <Step4
            data={form}
            onChangeEcheances={echeances => { setForm(prev => ({ ...prev, echeances })); }}
            onChangeNombre={n => { setForm(prev => ({ ...prev, nombreEcheances: n })); }}
            onNext={() => { setStep(5); }}
            onBack={() => { setStep(3); }}
          />
        )
      case 5:
        return (
          <Step5
            data={form}
            onChangeJustification={v => { setForm(prev => ({ ...prev, justification: v })); }}
            onChangeJustificatifs={items => { setForm(prev => ({ ...prev, justificatifs: items })); }}
            onNext={() => { setStep(6); }}
            onBack={() => { setStep(4); }}
          />
        )
      case 6:
        return (
          <Step6
            onBack={() => { setStep(5); }}
            onTerminer={handleSubmit}
            onCancel={() => { setView('list'); }}
          />
        )
      default:
        return <div />
    }
  }

  if (view === 'list') {
    return <FinancementListView demandes={demandes} onNew={startNew} />
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => { setView('list'); setStep(1); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux demandes
        </button>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E5E9F2',
        boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
        overflow: 'hidden',
      }}>
        {renderStep()}
      </div>
    </div>
  )
}