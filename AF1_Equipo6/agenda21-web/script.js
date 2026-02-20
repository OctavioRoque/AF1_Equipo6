// script.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gmozqaccfkzzwmxzkkkr.supabase.co'
const supabaseKey = 'sb_publishable_fFInKnwsSeUR6OUihs83ng_qzImGUNj'

const supabase = createClient(supabaseUrl, supabaseKey)

const imageInput = document.getElementById('imageUpload')
const pdfInput = document.getElementById('pdfUpload')
const imageList = document.getElementById('imageList')
const pdfList = document.getElementById('pdfList')

async function uploadFile(bucket, file) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(`${Date.now()}_${file.name}`, file)

    if (error) {
        alert('Error al subir archivo')
        console.error(error)
    } else {
        alert('Archivo subido correctamente')
        loadFiles(bucket)
    }
}

async function loadFiles(bucket) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .list('', { limit: 100 })

    if (error) {
        console.error(error)
        return
    }

    const container = bucket === 'imagenes' ? imageList : pdfList
    container.innerHTML = ''

    data.forEach(file => {
        const fileUrl = supabase
            .storage
            .from(bucket)
            .getPublicUrl(file.name).data.publicUrl

        const link = document.createElement('a')
        link.href = fileUrl
        link.textContent = file.name
        link.target = "_blank"
        link.classList.add('file-link')

        container.appendChild(link)
    })
}

const uploadImageBtn = document.getElementById('uploadImageBtn')
const uploadPdfBtn = document.getElementById('uploadPdfBtn')

uploadImageBtn?.addEventListener('click', () => {
    const file = imageInput.files[0]
    if (!file) {
        alert('Selecciona una imagen primero')
        return
    }
    uploadFile('imagenes', file)
})

uploadPdfBtn?.addEventListener('click', () => {
    const file = pdfInput.files[0]
    if (!file) {
        alert('Selecciona un PDF primero')
        return
    }
    uploadFile('doc', file)
})

loadFiles('imagenes')
loadFiles('doc')